<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDemandesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('demandes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->date('date_demande');
            $table->string('objet');
            $table->foreignId('student_id')->references('id')->on('etudiants')->onDelete('CASCADE');
            $table->foreignId('id_etat')->references('id')->on('demande_etats')->onDelete('CASCADE');
            $table->foreignId('id_type')->references('id')->on('types')->onDelete('CASCADE');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('demandes');
    }
}
