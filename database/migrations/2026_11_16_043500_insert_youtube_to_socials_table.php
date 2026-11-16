<?php

use App\Models\Social;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $exists = DB::table('socials')
            ->where('description', 'like', '%youtube%')
            ->orWhere('icon', 'like', '%youtube%')
            ->exists();

        if (!$exists) {
            Social::create([
                'name' => 'Vitromaxx',
                'description' => 'YouTube',
                'icon' => 'fab fa-youtube',
                'link' => 'https://www.youtube.com/@vitromaxx',
                'visible' => true,
                'status' => true,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('socials')
            ->where('description', 'like', '%youtube%')
            ->orWhere('icon', 'like', '%youtube%')
            ->delete();
    }
};
