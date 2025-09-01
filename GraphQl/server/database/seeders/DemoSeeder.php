<?php
namespace Database\Seeders; use Illuminate\Database\Seeder; use App\Models\User; use App\Models\Post; use App\Models\Comment;
class DemoSeeder extends Seeder { public function run(): void { $users=User::factory()->count(3)->sequence(['name'=>'Ada Lovelace'],['name'=>'Alan Turing'],['name'=>'Grace Hopper'])->create(); $users->each(function($user){ Post::factory()->count(7)->create(['user_id'=>$user->id])->each(function($post){ $count=rand(0,5); if($count>0){ Comment::factory()->count($count)->create(['post_id'=>$post->id]); } }); }); } }
