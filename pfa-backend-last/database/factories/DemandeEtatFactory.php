<?php

namespace Database\Factories;
use App\Models\DemandeEtat;
use Illuminate\Database\Eloquent\Factories\Factory;

class DemandeEtatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    protected $model = DemandeEtat::class;
    public function definition()
    {
        return [
            'intitule' => $this->faker->unique()->randomElement(['en attente', 'validée', 'refusée']),
        ];
    }
}
