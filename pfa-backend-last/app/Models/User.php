<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;
    protected $fillable = ['nom', 'prenom', 'email', 'tel', 'CIN', 'id_role', 'login', 'password', 'photo'];

    public function role()
    {
        return $this->belongsTo(Role::class, 'id_role');
    }

    public function student()
    {
        return $this->hasOne(Student::class);
    }
}
