<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DemandeEtat;

class DemandeEtatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DemandeEtat::factory()->count(3)->create();
    }
}
