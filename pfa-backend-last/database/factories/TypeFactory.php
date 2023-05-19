<?php

namespace Database\Factories;
use App\Models\Type;
use Illuminate\Database\Eloquent\Factories\Factory;

class TypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    protected $model = Type::class;
    public function definition()
    {
        return [
            'intitule' => $this->faker->unique()->randomElement(['examen', 'scolarité']),
        ];
    }
}
