<?php
namespace App\GraphQL\Mutations; use App\Models\Post;
class CreatePost { public function __invoke($_, array $args){ $userId=\App\Models\User::query()->value('id') ?? \App\Models\User::factory()->create()->id; return Post::create(['user_id'=>$userId,'title'=>$args['title'],'body'=>$args['body']]); } }
