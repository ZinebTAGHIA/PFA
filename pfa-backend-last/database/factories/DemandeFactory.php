<?php

namespace Database\Factories;

use App\Models\Demande;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Etudiant;
use App\Models\DemandeEtat;
use App\Models\Type;

class DemandeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    protected $model = Demande::class;
    public function definition()
    {
        $objet = $this->faker->randomElement(["Certificat de scolarité", "Attestation de scolarité", "Convention de stage", "Relevé de notes", "Retrait du Bac", "Retrait du diplôme"]);

        $type = "";

        if ($objet == "Certificat de scolarité" || $objet == "Attestation de scolarité" || $objet == "Convention de stage") {
            $type = "examen";
        } else {
            $type = "scolarité";
        }

        $id_type = Type::where('intitule', $type)->first()->id;
        return [
            'date_demande' => $this->faker->dateTimeBetween('-2 year', 'now'),
            'objet' => $objet,
            'student_id' => Etudiant::inRandomOrder()->first()->id,
            'id_etat' => DemandeEtat::inRandomOrder()->first()->id,
            'id_type' => $id_type,
        ];
    }
}
