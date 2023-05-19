<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\DemandeEtat;
use Illuminate\Http\Request;

class EtatController extends Controller
{
    public function findEtatByID($id)
    {
        $etat = DemandeEtat::find($id);
        if (!$etat) {
            return response()->json(['error' => 'Etat not found'], 404);
        }
        return response()->json(
            $etat->intitule,
        );
    }
}
