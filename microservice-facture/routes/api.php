<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FactureController;

Route::prefix('factures')->group(function () {
    Route::post('/', [FactureController::class, 'store']);
    Route::get('/', [FactureController::class, 'index']);

    Route::get('/name/{name}', [FactureController::class, 'getByName']);
    Route::get('/date/{date}', [FactureController::class, 'getByDate']);
    Route::get('/{id}/produits', [FactureController::class, 'getProduitsByFactureId']);


    Route::delete('/name/{name}', [FactureController::class, 'deleteByName']);
    Route::delete('/date/{date}', [FactureController::class, 'deleteByDate']);
});
