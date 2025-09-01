<?php
use Illuminate\Support\Facades\Route; use App\Http\Controllers\PostController; use App\Http\Controllers\CommentController;
Route::get('/posts',[PostController::class,'index']); Route::post('/posts',[PostController::class,'store']); Route::get('/posts/{post}',[PostController::class,'show']); Route::put('/posts/{post}',[PostController::class,'update']); Route::delete('/posts/{post}',[PostController::class,'destroy']); Route::get('/posts/{post}/comments',[CommentController::class,'index']); Route::post('/posts/{post}/comments',[CommentController::class,'store']);
