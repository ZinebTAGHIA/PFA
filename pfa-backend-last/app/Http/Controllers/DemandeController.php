<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\DemandeEtat;
use App\Models\Etudiant;
use App\Models\Type;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DemandeController extends Controller
{
    public function findAllDemandes()
    {
        $demandes = Demande::all();

        if (!$demandes) {
            return response()->json(['error' => 'Demandes not found'], 404);
        }
        return response()->json([
            'data' => $demandes,
        ]);
    }

    public function findAllDemandesWithEtat_Student()
    {
        $demandes = Demande::join('etudiants', 'demandes.student_id', '=', 'etudiants.id')
            ->join('users', 'etudiants.user_id', '=', 'users.id')
            ->join('demande_etats', 'demandes.id_etat', '=', 'demande_etats.id')
            ->select('demandes.id', 'demandes.objet', 'demandes.date_demande', 'users.nom', 'users.prenom','users.id', 'demande_etats.intitule')
            ->get();
        if (!$demandes) {
            return response()->json(['error' => 'Demandes not found'], 404);
        }
        return response()->json([
            'data' => $demandes,
        ]);
    }

    public function findDemandesByEtatWithEtat_Student($etat)
    {
        $etat_id = DemandeEtat::where('intitule', $etat)->first()->id;

        $demandes = Demande::join('etudiants', 'demandes.student_id', '=', 'etudiants.id')
            ->join('users', 'etudiants.user_id', '=', 'users.id')
            ->join('demande_etats', 'demandes.id_etat', '=', 'demande_etats.id')
            ->select('demandes.id', 'demandes.objet', 'demandes.date_demande', 'users.nom', 'users.prenom','users.id', 'demande_etats.intitule')
            ->where('id_etat', $etat_id)
            ->get();

        if (!$demandes) {
            return response()->json(['error' => 'Demandes not found'], 404);
        }
        return response()->json([
            'data' => $demandes,
        ]);
    }

    public function findDemandesByEtat_TypeWithEtat_Student($etat, $type)
    {
        $etat_id = DemandeEtat::where('intitule', $etat)->first()->id;
        $id_type = Type::where('intitule', $type)->first()->id;

        $demandes = Demande::join('etudiants', 'demandes.student_id', '=', 'etudiants.id')
            ->join('users', 'etudiants.user_id', '=', 'users.id')
            ->join('demande_etats', 'demandes.id_etat', '=', 'demande_etats.id')
            ->select('demandes.id', 'demandes.objet', 'demandes.date_demande', 'users.nom', 'users.prenom','users.id as user_id', 'demande_etats.intitule')
            ->where('id_etat', $etat_id)
            ->where('id_type', $id_type)
            ->get();

        if (!$demandes) {
            return response()->json(['error' => 'Demandes not found'], 404);
        }
        return response()->json([
            'data' => $demandes,
        ]);
    }

    public function findDemandeByID($id)
    {
        $demande = Demande::find($id);

        if (!$demande) {
            return response()->json(['error' => 'Demande not found'], 404);
        }
        return response()->json([
            'data' => $demande,
        ]);
    }

    public function findDemandesByEtat($etat)
    {
        $etat_id = DemandeEtat::where('intitule', $etat)->first()->id;
        $demandes = Demande::where('id_etat', $etat_id)->get();

        if (!$demandes) {
            return response()->json(['error' => 'Demandes not found'], 404);
        }
        return response()->json([
            'data' => $demandes,
        ]);
    }

    public function findDemandesByType($type)
    {
        $type_id = Type::where('intitule', $type)->first()->id;
        $demandes = Demande::where('id_type', $type_id)->get();

        if (!$demandes) {
            return response()->json(['error' => 'Demandes not found'], 404);
        }
        return response()->json([
            'data' => $demandes,
        ]);
    }

    public function findDemandesByStudent($id)
    {
        $demandes = Demande::where('student_id', $id)->get();

        if (!$demandes) {
            return response()->json(['error' => 'Demandes not found'], 404);
        }
        return response()->json([
            'data' => $demandes,
        ]);
    }

    public function findDemandesByUser_Etat($etat, $id)
    {
        $etudiant_id = Etudiant::where('user_id', $id)->first()->id;
        $id_etat = DemandeEtat::where('intitule', $etat)->first()->id;
        $demandes = Demande::where('student_id', $etudiant_id)
            ->where('id_etat', $id_etat)
            ->get();

        if (!$demandes) {
            return response()->json(['error' => 'Demandes not found'], 404);
        }
        return response()->json([
            'data' => $demandes,
        ]);
    }

    public function store(Request $request)
    {
        $demande = new Demande();
        $id_type = Type::where('intitule', $request->type)->first()->id;
        $id_etat = DemandeEtat::where('intitule', 'en attente')->first()->id;
        $student_id = Etudiant::where('user_id', $request->user_id)->first()->id;
        $demande->date_demande = date('Y-m-d');
        $demande->objet = $request->input('objet');
        $demande->student_id = $student_id;
        $demande->id_etat = $id_etat;
        $demande->id_type = $id_type;
        $demande->save();

        return response()->json([
            'message' => 'Demande created successfully.',
            'data' => $demande,
        ]);
    }

    public function update(Request $request, $id)
    {
        $demande = Demande::find($id);
        if (!$demande) {
            return response()->json(['error' => 'Demande not found'], 404);
        }
        $id_type = Type::where('intitule', $request->type)->first()->id;
        $demande->date_demande = date('Y-m-d');
        $demande->objet = $request->input('objet');
        $demande->id_type = $id_type;
        $demande->save();

        return response()->json([
            'message' => 'Demande updated successfully.',
            'data' => $demande,
        ]);
    }

    public function destroy($id)
    {
        $demande = Demande::find($id);
        if (!$demande) {
            return response()->json(['error' => 'Demande not found'], 404);
        }
        $demande->delete();
        return response()->json([
            'message' => 'Demande deleted successfully.',
        ]);
    }

    public function valider($id)
    {
        $demande = Demande::find($id);
        if (!$demande) {
            return response()->json(['error' => 'Demande not found'], 404);
        }
        $id_etat = DemandeEtat::where('intitule', 'validée')->first()->id;
        $demande->id_etat = $id_etat;
        $demande->save();
        return response()->json([
            'message' => 'Demande validated successfully.',
        ]);
    }

    public function refuser($id)
    {
        $demande = Demande::find($id);
        if (!$demande) {
            return response()->json(['error' => 'Demande not found'], 404);
        }
        $id_etat = DemandeEtat::where('intitule', 'refusée')->first()->id;
        $demande->id_etat = $id_etat;
        $demande->save();
        return response()->json([
            'message' => 'Demande validated successfully.',
        ]);
    }

    public function CountAllDemandes()
    {
        $demandes = Demande::all();

        if (!$demandes) {
            return response()->json(['error' => 'Demandes not found'], 404);
        }

        $nbr_demandes = count($demandes);
        return response()->json([
            'total' => $nbr_demandes,
        ]);
    }

    public function CountDemandesByEtat($etat)
    {
        $etat_id = DemandeEtat::where('intitule', $etat)->first()->id;
        $demandes = Demande::where('id_etat', $etat_id)->get();

        if (!$demandes) {
            return response()->json(['error' => 'Demandes not found'], 404);
        }
        $nbr_demandes = count($demandes);
        return response()->json([
            'total' => $nbr_demandes,
        ]);
    }
}
