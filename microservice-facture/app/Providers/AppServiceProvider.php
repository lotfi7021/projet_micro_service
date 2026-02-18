<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Config;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // 🚫 Ne pas exécuter pour les commandes artisan
        if (app()->runningInConsole()) {
            return;
        }

        $dbName = Config::get('database.connections.mysql.database');

        try {
            // 🔹 Test connexion DB
            DB::connection()->getPdo();
        } catch (\Exception $e) {

            // 🔹 Connexion MySQL SANS base
            Config::set('database.connections.mysql.database', null);
            DB::reconnect();

            // 🔹 Création DB si inexistante
            DB::statement("
                CREATE DATABASE IF NOT EXISTS `$dbName`
                CHARACTER SET utf8mb4
                COLLATE utf8mb4_unicode_ci
            ");

            // 🔹 Reconnexion avec la DB
            Config::set('database.connections.mysql.database', $dbName);
            DB::reconnect();
        }

        // 🔹 Création des tables si inexistantes
        $this->createTablesIfNotExist();
    }

    private function createTablesIfNotExist(): void
    {
        if (!Schema::hasTable('factures')) {
            Schema::create('factures', function ($table) {
                $table->id();
                $table->date('date_creation');
                $table->string('name_vendeur');
                $table->decimal('totale_vente', 10, 2);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('facture_produits')) {
            Schema::create('facture_produits', function ($table) {
                $table->id();
                $table->foreignId('id_facture')
                      ->constrained('factures')
                      ->onDelete('cascade');
                $table->string('product_name');
                $table->string('matricule');
                $table->integer('quantite');
                $table->decimal('prix_vente', 10, 2);
                $table->timestamps();
            });
        }
    }
}
