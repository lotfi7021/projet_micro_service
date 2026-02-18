<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    protected $fillable = [
        'date_creation',
        'name_vendeur',
        'totale_vente'
    ];

    public function produits()
    {
        return $this->hasMany(FactureProduit::class, 'id_facture');
    }
}
