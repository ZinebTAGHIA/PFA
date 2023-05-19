<?php

namespace Database\Factories;

use App\Models\Etudiant;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class EtudiantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    protected $model = Etudiant::class;
    private static $usedUserIds = [];
    public function definition()
    {

        $cne = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 1)) . substr(str_shuffle('0123456789'), 0, 11);
        $role_id = Role::where('intitule', 'Etudiant')->first()->id;

        $user = User::where('id_role', $role_id)
            ->whereNotIn('id', self::$usedUserIds)
            ->inRandomOrder()
            ->firstOrFail();

        // Add the user's ID to the list of used IDs
        self::$usedUserIds[] = $user->id;
        return [
            'CNE' => $cne,
            'initial_password' => Hash::make($cne),
            'is_Activated' => $this->faker->boolean(80),
            'user_id' => $user->id,
        ];
    }
}
