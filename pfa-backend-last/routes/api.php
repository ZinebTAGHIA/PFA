<?php

use App\Http\Controllers\DemandeController;
use App\Http\Controllers\EtatController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('login', [LoginController::class, 'login'])->name("login");

Route::middleware(['auth:sanctum'])->group(
    function () {
        Route::post('logout', [LoginController::class, 'logout']);

        Route::get('/demandes', [DemandeController::class, 'findAllDemandesWithEtat_Student']);
        // Route::get('/demandes', [DemandeController::class, 'findAllDemandes'])->name('demandes');
        Route::get('/demandes/etat/{etat}/type/{id}', [DemandeController::class, 'findDemandesByEtat_TypeWithEtat_Student']);
        Route::get('/demandes/etat/{etat}', [DemandeController::class, 'findDemandesByEtatWithEtat_Student']);
        Route::get('/demandes/type/{type}', [DemandeController::class, 'findDemandesByType'])->name('demandesByTypes');
        Route::get('/demandes/id/{id}', [DemandeController::class, 'findDemandeByID']);
        Route::get('/demandes/student/{id}', [DemandeController::class, 'findDemandesByStudent'])->name('demandesByStudent');
        Route::get('/demandes/etat/{etat}/student/{id}', [DemandeController::class, 'findDemandesByUser_Etat']);
        Route::post('/demandes', [DemandeController::class, 'store']);
        Route::put('/demandes/{id}', [DemandeController::class, 'update']);
        Route::delete('/demandes/{id}', [DemandeController::class, 'destroy']);
        Route::put('/demandes/valider/{id}', [DemandeController::class, 'valider']);
        Route::put('/demandes/refuser/{id}', [DemandeController::class, 'refuser']);
        Route::get('/nbr/demandes', [DemandeController::class, 'CountAllDemandes']);
        Route::get('/nbr/demandes/{etat}', [DemandeController::class, 'CountDemandesByEtat']);

        Route::get('/users', [UserController::class, 'findAllUsers']);
        Route::get('/users/students', [UserController::class, 'findAllStudentUsers']);
        Route::get('/users/students/{etat}', [UserController::class, 'findAllStudentUsersByEtat']);
        Route::get('/users/{id}', [UserController::class, 'findUserByID'])->name('findUser');
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::post('/users/edit-photo/{id}', [UserController::class, 'updatePhoto']);
        Route::get('/etat/{id}', [EtatController::class, 'findEtatByID']);
        Route::get('/users/role/{id}', [UserController::class, 'findUserRole']);
        Route::get('/types/{type}', [TypeController::class, 'findTypeByIntitule']);
        Route::put('/reset-pass/{id}', [UserController::class, 'resetPassword']);

        Route::put('/edit/users/{id}', [EtudiantController::class, 'update']);
        Route::get('/nbr/etudiants', [EtudiantController::class, 'CountAllEtudiants']);
        Route::get('/nbr/etudiants/{etat}', [EtudiantController::class, 'counEtudiantByEtat']);


        Route::get('/notifications/{id}', [NotificationController::class, 'findAllNotifByUser']);
        Route::post('/notifications', [NotificationController::class, 'store']);
        Route::put('/notif/{id}', [NotificationController::class, 'markAsRead']);
    }
);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
