<?php

use Illuminate\Support\Facades\Route;

Route::get('/adminpanel/{page}', alexmes\adminpanel\Http\Controllers\AdminPanelController::class)->where('page', '.*');

Route::get('/codegen/{table_id}', [alexmes\adminpanel\Http\Controllers\AdminPanelController::class, 'codegen']);

/*Route::get('/adminpanel', function () {
    return view('adminpanel::index');
});*/
