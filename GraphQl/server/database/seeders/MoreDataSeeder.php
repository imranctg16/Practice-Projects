<?php
namespace Database\Seeders; use Illuminate\Database\Seeder; use App\Models\User; use App\Models\Post; use App\Models\Comment;
class MoreDataSeeder extends Seeder { public function run(): void { if(User::count()<5){ User::factory()->count(2)->create(); } $userIds=User::pluck('id'); Post::factory()->count(50)->create(function() use($userIds){ return ['user_id'=>$userIds->random()]; })->each(function($post){ Comment::factory()->count(rand(1,6))->create(['post_id'=>$post->id]); }); } }
