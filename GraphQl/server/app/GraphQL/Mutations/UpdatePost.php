<?php
namespace App\GraphQL\Mutations; use App\Models\Post;
class UpdatePost { public function __invoke($_, array $args){ $post=Post::findOrFail($args['id']); $data=[]; if(array_key_exists('title',$args)) $data['title']=$args['title']; if(array_key_exists('body',$args)) $data['body']=$args['body']; $post->update($data); return $post->fresh(); } }
