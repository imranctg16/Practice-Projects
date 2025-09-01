<?php
namespace App\GraphQL\Mutations; use App\Models\Post;
class DeletePost { public function __invoke($_, array $args){ $post=Post::findOrFail($args['id']); return (bool)$post->delete(); } }
