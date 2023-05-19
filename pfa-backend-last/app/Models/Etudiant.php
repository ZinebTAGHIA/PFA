<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    use HasFactory;
    protected $fillable = ['CNE', 'initial_password', 'is_Activated','user_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function demandes()
    {
        return $this->hasMany(Demande::class);
    }
}
