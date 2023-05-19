<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{

    public function findAllNotifByUser($id)
    {
        $notifs = Notification::where('id_user', $id)->get();

        if (!$notifs) {
            return response()->json(['error' => 'Notifications not found'], 404);
        }
        return response()->json([
            'data' => $notifs,
        ]);
    }


    public function store(Request $request)
    {
        $notif = new Notification();
        $notif->content = $request->message;
        $notif->date_notif = date('Y-m-d');
        $notif->is_read = false;
        $notif->id_user = $request->user_id;
        $notif->save();

        return response()->json([
            'message' => 'Demande created successfully.',
            'data' => $notif,
        ]);
    }

    public function markAsRead($id)
    {
        $notif = Notification::find($id);
        if (!$notif) {
            return response()->json(['error' => 'notif not found'], 404);
        }
        $notif->is_read = true;
        $notif->save();

        return response()->json([
            'message' => 'Demande read successfully.',
        ]);
    }
}
