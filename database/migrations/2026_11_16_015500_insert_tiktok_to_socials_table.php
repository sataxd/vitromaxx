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
            ->where('description', 'like', '%tiktok%')
            ->orWhere('icon', 'like', '%tiktok%')
            ->exists();

        if (!$exists) {
            Social::create([
                'name' => 'Vitromaxx',
                'description' => 'TikTok',
                'icon' => 'fab fa-tiktok',
                'link' => 'https://www.tiktok.com/@vitromaxx',
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
            ->where('description', 'TikTok')
            ->orWhere('icon', 'fab fa-tiktok')
            ->delete();
    }
};
