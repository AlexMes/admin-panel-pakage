<?php

namespace alexmes\adminpanel\Http\Controllers;

use Illuminate\Http\Request;

class AdminPanelController extends Controller
{
    public function __invoke(Request $request)
    {
        return view('adminpanel::index');
    }
}
