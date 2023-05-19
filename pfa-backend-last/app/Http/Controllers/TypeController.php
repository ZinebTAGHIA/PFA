<?php

namespace App\Http\Controllers;

use App\Models\Type;
use Illuminate\Http\Request;

class TypeController extends Controller
{
    public function findTypeByIntitule($type)
    {
        $type_id = Type::where("intitule", $type)->first()->id;
        if (!$type_id) {
            return response()->json(['error' => 'Type not found'], 404);
        }
        return response()->json([
            'id' => $type_id
        ]);
    }
}
