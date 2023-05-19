<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    protected $model = Role::class;
    public function definition()
    {
        return [
            'intitule' => $this->faker->unique()->randomElement(['Admin Examen', 'Admin Scolarité', 'Etudiant']),
        ];
    }
}
