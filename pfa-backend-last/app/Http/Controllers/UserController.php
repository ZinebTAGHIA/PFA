<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use App\Http\Controllers\EtudiantController;
use App\Models\Etudiant;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function findAllUsers()
    {
        $users = User::all();

        if (!$users) {
            return response()->json(['error' => 'Users not found'], 404);
        }
        return response()->json([
            'data' => $users,
        ]);
    }

    public function findAllStudentUsers()
    {
        $users = User::join('etudiants', 'users.id', '=', 'etudiants.user_id')
            ->select('users.*', 'etudiants.id as etud_id', 'etudiants.CNE', 'etudiants.initial_password', 'etudiants.is_Activated', 'etudiants.user_id')
            ->get();

        if (!$users) {
            return response()->json(['error' => 'Users not found'], 404);
        }
        return response()->json([
            'data' => $users,
        ]);
    }

    public function findAllStudentUsersByEtat($etat)
    {
        $isActive = false;
        if ($etat == 1) {
            $isActive = true;
        }
        $users = User::join('etudiants', 'users.id', '=', 'etudiants.user_id')
            ->select('users.*', 'etudiants.id as etud_id', 'etudiants.CNE', 'etudiants.initial_password', 'etudiants.is_Activated', 'etudiants.user_id')
            ->where('etudiants.is_Activated', $isActive)
            ->get();

        if (!$users) {
            return response()->json(['error' => 'Users not found'], 404);
        }
        return response()->json([
            'data' => $users,
        ]);
    }

    public function findUserByID($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        return response()->json([
            'data' => $user,
        ]);
    }

    public function findUserRole($id_user)
    {
        $user = User::find($id_user);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $role = Role::find($user->id_role)->intitule;
        return response()->json([
            'role' => $role
        ]);
    }
    // public function findUserByCIN($cin){

    //     $user = User::where('CIN', $cin);
    //     if (!$user) {
    //         return response()->json(['error' => 'User not found'], 404);
    //     }
    //     return response()->json([
    //         'data' => $user,
    //     ]);
    // }

    public function updatePhoto(Request $request, $id)
    {
        // dd($request->photo);
        // $request->validate(['photo' => 'required|image|mimes:png,jpg,jpeg|max:100000']);

        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        try {
            $img_name = Str::random(32) . "." . $request->photo->getClientOriginalExtension();

            $user->photo = $img_name;
            $user->save();

            Storage::disk('public')->put($img_name, file_get_contents($request->photo));

            return response()->json([
                'message' => "Photo successfully updated"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Something went wrong !'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $user = new User();
        $user->nom = $request->input('nom');
        $user->prenom = $request->input('prenom');

        $email = $request->input('email');
        $tel = $request->input('tel');
        if ($email) {
            $user->email = $email;
        }
        if ($tel) {
            $user->tel = $tel;
        }

        $user->CIN = $request->input('CIN');

        $role = $request->input('role');
        $id_role = Role::where('intitule', $role)->first()->id;
        $user->id_role = $id_role;

        $user->login = $request->input('CIN');
        $user->password = Hash::make($request->input('CNE'));
        $user->save();

        if ($role == "Etudiant") {
            //create new student
            $etudController = new EtudiantController();
            return $etudController->store($request)
                . response()->json([
                    'message' => 'User created successfully.',
                    'data' => $user,
                ]);
        }

        return response()->json([
            'message' => 'User created successfully.',
            'data' => $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $role = Role::find($user->id_role);
        $user->nom = $request->input('nom');
        $user->prenom = $request->input('prenom');
        $user->email = $request->input('email');
        $user->tel = $request->input('tel');
        if ($request->password) {
            $user->password = Hash::make($request->input('password'));
        }
        $user->save();

        return response()->json([
            'message' => 'User updated successfully.',
            'data' => $user,
        ]);
    }

    public function resetPassword($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $etudiant = Etudiant::where('user_id', $id)->first();
        $user->password = $etudiant->initial_password;
        $user->save();
    }
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $user->delete();
        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }
}
