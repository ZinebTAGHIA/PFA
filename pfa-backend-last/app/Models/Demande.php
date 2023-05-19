<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    use HasFactory;
    protected $fillable = ['date_demande', 'objet', 'student_id', 'id_etat', 'id_type'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function type()
    {
        return $this->belongsTo(Type::class, 'id_type');
    }

    public function etat()
    {
        return $this->belongsTo(DemandeEtat::class, 'id_etat');
    }
}
