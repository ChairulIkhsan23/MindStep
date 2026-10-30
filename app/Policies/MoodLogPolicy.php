<?php

namespace App\Policies;

use App\Models\MoodLog;
use App\Models\User;

class MoodLogPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, MoodLog $moodLog): bool
    {
        return $moodLog->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, MoodLog $moodLog): bool
    {
        return $moodLog->user_id === $user->id;
    }

    public function delete(User $user, MoodLog $moodLog): bool
    {
        return $moodLog->user_id === $user->id;
    }
}
