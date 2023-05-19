<?php

namespace App\Http\Controllers;

use App\Models\Etudiant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    /**
     * Handle an authentication attempt.
     */
    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'login' => 'required',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'validation_errors' => $errors,
            ]);
        } else {
            $user = User::where('login', $request->login)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Invalid Credentials'
                ]);
            } else {
                $role_id = $user->id_role;
                $role = Role::find($role_id)->intitule;

                if ($role == "Etudiant") {

                    $student = Etudiant::where('user_id', $user->id)->first();
                    $isActive = $student->is_Activated;

                    if (!$isActive) {
                        return response()->json([
                            'status' => 403,
                            'message' => 'The provided account is not active.'
                        ]);
                    }
                }

                $token = $user->createToken($user->login . '_Token')->plainTextToken;
                return response()->json([
                    'status' => 200,
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'CIN' => $user->CIN,
                    'email' => $user->email,
                    'tel' => $user->tel,
                    'role' => $role,
                    'token' => $token,
                    'message' => 'Logged In Successfully',
                ]);
            }
        }
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json([
            'status' => 200,
            'message' => 'Logged Out Successfully'
        ]);
    }
}
