<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facture;
use App\Models\FactureProduit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http; 
use Illuminate\Support\Facades\Log;

class FactureController extends Controller
{
public function store(Request $request)
{
    Log::info('🟢 Début création facture');

    // 1️⃣ Validation
    $request->validate([
        'date_creation' => 'required|date',
        'name_vendeur' => 'required|string',
        'produits' => 'required|array|min:1',
        'produits.*.product_name' => 'required|string',
        'produits.*.matricule' => 'required|string',
        'produits.*.quantite' => 'required|integer|min:1',
        'produits.*.prix_vente' => 'required|numeric',
    ]);

    DB::beginTransaction();

    try {

        // 2️⃣ Création facture (temporaire)
        $facture = Facture::create([
            'date_creation' => $request->date_creation,
            'name_vendeur' => $request->name_vendeur,
            'totale_vente' => 0,
        ]);

        Log::info('📄 Facture créée', [
            'facture_id' => $facture->id,
            'vendeur' => $request->name_vendeur
        ]);

        $total = 0;

        // 3️⃣ Traitement des produits
        foreach ($request->produits as $produit) {

            Log::info('📦 Traitement produit', $produit);

            // 🔹 Appel microservice STOCK
            $url = config('services.stock.url')
                . "/products/matricule/{$produit['matricule']}/decrementer";

            Log::info('➡ Appel service stock', [
                'url' => $url,
                'quantite' => $produit['quantite']
            ]);

            $response = Http::timeout(5)->put($url, [
                'quantite' => $produit['quantite']
            ]);

            Log::info('⬅ Réponse stock', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            // ❌ Échec décrémentation
            if ($response->failed()) {
                Log::error('❌ Échec décrémentation stock', [
                    'matricule' => $produit['matricule'],
                    'response' => $response->body()
                ]);

                throw new \Exception(
                    "Stock insuffisant pour le produit {$produit['matricule']}"
                );
            }

            // 4️⃣ Sauvegarde produit facture
            FactureProduit::create([
                'id_facture' => $facture->id,
                'product_name' => $produit['product_name'],
                'matricule' => $produit['matricule'],
                'quantite' => $produit['quantite'],
                'prix_vente' => $produit['prix_vente'],
            ]);

            Log::info('✅ Produit ajouté à la facture', [
                'matricule' => $produit['matricule']
            ]);

            $total += $produit['quantite'] * $produit['prix_vente'];
        }

        // 5️⃣ Mise à jour total
        $facture->update([
            'totale_vente' => $total
        ]);

        Log::info('💰 Total facture calculé', [
            'facture_id' => $facture->id,
            'total' => $total
        ]);

        DB::commit();

        Log::info('🎉 Facture créée avec succès');

        return response()->json([
            'message' => 'Facture créée avec succès',
            'facture_id' => $facture->id,
            'total' => $total
        ], 201);

    } catch (\Exception $e) {

        DB::rollBack();

        Log::error('🔥 Erreur création facture', [
            'error' => $e->getMessage()
        ]);

        return response()->json([
            'error' => $e->getMessage()
        ], 400);
    }
}



    public function index()
    {
        return Facture::with('produits')->get();
    }

    public function getByName($name)
    {
        return Facture::with('produits')
            ->where('name_vendeur', 'like', "%$name%")
            ->get();
    }

    public function getByDate($date)
    {
        return Facture::with('produits')
            ->whereDate('date_creation', $date)
            ->get();
    }

    public function deleteByName($name)
    {
        Facture::where('name_vendeur', 'like', "%$name%")
            ->each(fn ($f) => $f->delete());

        return response()->json(['message' => 'Factures supprimées']);
    }

    public function deleteByDate($date)
    {
        Facture::whereDate('date_creation', $date)
            ->each(fn ($f) => $f->delete());

        return response()->json(['message' => 'Factures supprimées']);
    }
    public function getProduitsByFactureId($id)
{
    $facture = Facture::with('produits')->find($id);

    if (!$facture) {
        return response()->json([
            'message' => 'Facture non trouvée'
        ], 404);
    }

    return response()->json($facture->produits);
}

}
