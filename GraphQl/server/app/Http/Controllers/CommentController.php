<?php
namespace App\Http\Controllers; use App\Models\Post; use App\Http\Resources\CommentResource; use Illuminate\Http\Request;
class CommentController extends Controller { public function index(Post $post){ return CommentResource::collection($post->comments()->latest()->paginate(10)); } public function store(Request $request, Post $post){ $data=$request->validate(['body'=>'required|string']); $comment=$post->comments()->create($data); return new CommentResource($comment); } }
