<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Factories\EtudiantFactory;
use App\Models\Role;
use App\Models\User;
use App\Models\Etudiant;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        $this->call(TypeSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(DemandeEtatSeeder::class);
        $this->call(UserSeeder::class);

        $role_id = Role::where('intitule', 'Etudiant')->first()->id;
        $nbr_etudiant = User::where('id_role', $role_id)->count();
        Etudiant::factory()->count($nbr_etudiant)->create();
        
        $this->call(EtudiantSeeder::class);
        $this->call(DemandeSeeder::class);
    }
}
