<?php

namespace App\Http\Controllers;

use App\Models\Etudiant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class EtudiantController extends Controller
{
    public function findAllEtudiants()
    {
        $etudiants = Etudiant::all();

        if (!$etudiants) {
            return response()->json(['error' => 'Etudiants not found'], 404);
        }
        return response()->json([
            'data' => $etudiants,
        ]);
    }

    public function findEtudiantByID($id)
    {
        $etudiant = Etudiant::find($id);

        if (!$etudiant) {
            return response()->json(['error' => 'Etudiant not found'], 404);
        }
        return response()->json([
            'data' => $etudiant,
        ]);
    }

    public function store(Request $request)
    {
        $etudiant = new Etudiant();
        $cne = $request->input('CNE');
        $etudiant->CNE = $cne;
        $etudiant->initial_password = Hash::make($cne);
        $etudiant->is_Activated = true;

        $user_id = User::where('CIN', $request->input('CIN'))->first()->id;
        $etudiant->user_id = $user_id;
        $etudiant->save();

        return response()->json([
            'message' => 'Etudiant created successfully.',
            'data' => $etudiant,
        ]);
    }

    public function update(Request $request, $id)
    {
        $etudiant = Etudiant::where('user_id', $id)->first();
        if (!$etudiant) {
            return response()->json(['error' => 'Etudiant not found'], 404);
        }

        $etudiant->is_Activated = $request->input('is_Activated');
        $etudiant->save();


        return response()->json([
            'message' => 'Etudiant updated successfully.',
            'data' => $etudiant,
        ]);
    }

    public function changeActivationState(Request $request, $id)
    {
        $etudiant = Etudiant::where('user_id', $id)->first();
        if (!$etudiant) {
            return response()->json(['error' => 'Etudiant not found'], 404);
        }
        $etudiant->is_Activated = $request->input('is_Activated');
        $etudiant->save();

        return response()->json([
            'message' => 'Activation State updated successfully.',
            'data' => $etudiant,
        ]);
    }

    public function CountAllEtudiants()
    {
        $etudiants = Etudiant::all();

        if (!$etudiants) {
            return response()->json(['error' => 'Etudiants not found'], 404);
        }

        $nbr_etudiants = count($etudiants);
        return response()->json([
            'total' => $nbr_etudiants,
        ]);
    }

    public function counEtudiantByEtat($etat)
    {
        $etudiants = Etudiant::where('is_Activated', $etat)->get();
        if (!$etudiants) {
            return response()->json(['error' => 'Etudiants not found'], 404);
        }

        $nbr_etudiants = count($etudiants);
        return response()->json([
            'total' => $nbr_etudiants
        ]);
    }
}
