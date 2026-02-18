<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FactureProduit extends Model
{
    protected $fillable = [
        'id_facture',
        'product_name',
        'matricule',
        'quantite',
        'prix_vente'
    ];
}
