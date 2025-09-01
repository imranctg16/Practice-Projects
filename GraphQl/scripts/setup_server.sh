#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR=${1:-server}

color() { printf "\033[%sm%s\033[0m\n" "$1" "$2"; }
info() { color 36 "[server] $1"; }
ok() { color 32 "[server] $1"; }
warn() { color 33 "[server] $1"; }
err() { color 31 "[server] $1"; }

require_cmd() { if ! command -v "$1" >/dev/null 2>&1; then err "Missing required command: $1"; exit 1; fi; }

main() {
  require_cmd composer; require_cmd php
  info "Creating Laravel app in $TARGET_DIR"
  if [ ! -d "$TARGET_DIR" ]; then
    composer create-project laravel/laravel "$TARGET_DIR"
  else
    warn "$TARGET_DIR exists; continuing"
  fi
  cd "$TARGET_DIR"

  info "Install Lighthouse"
  composer require nuwave/lighthouse
  php artisan vendor:publish --tag=lighthouse-schema --force
  php artisan vendor:publish --tag=lighthouse-config --force

  info "Configure SQLite"
  sed -i.bak 's/^DB_CONNECTION=.*/DB_CONNECTION=sqlite/' .env || true
  sed -i.bak 's/^DB_DATABASE=.*/DB_DATABASE=/' .env || true
  mkdir -p database && touch database/database.sqlite

  info "Make models/controllers/resources"
  php artisan make:model Post -mcr
  php artisan make:model Comment -mcr
  php artisan make:resource PostResource || true
  php artisan make:resource CommentResource || true

  info "Write migrations"
  POST_MIG=$(ls -1 database/migrations/*create_posts_table*.php | head -n1)
  COMM_MIG=$(ls -1 database/migrations/*create_comments_table*.php | head -n1 || true)
  if [ -z "${COMM_MIG:-}" ]; then php artisan make:migration create_comments_table; COMM_MIG=$(ls -1 database/migrations/*create_comments_table*.php | head -n1); fi
  cat > "$POST_MIG" <<'PHP'
<?php
use Illuminate\Database\Migrations\Migration; use Illuminate\Database\Schema\Blueprint; use Illuminate\Support\Facades\Schema;
return new class extends Migration { public function up(): void { Schema::create('posts', function (Blueprint $table) { $table->id(); $table->foreignId('user_id')->constrained()->cascadeOnDelete(); $table->string('title'); $table->text('body'); $table->timestamps(); }); } public function down(): void { Schema::dropIfExists('posts'); } };
PHP
  cat > "$COMM_MIG" <<'PHP'
<?php
use Illuminate\Database\Migrations\Migration; use Illuminate\Database\Schema\Blueprint; use Illuminate\Support\Facades\Schema;
return new class extends Migration { public function up(): void { Schema::create('comments', function (Blueprint $table) { $table->id(); $table->foreignId('post_id')->constrained()->cascadeOnDelete(); $table->text('body'); $table->timestamps(); }); } public function down(): void { Schema::dropIfExists('comments'); } };
PHP

  info "Write models"
  cat > app/Models/Post.php <<'PHP'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory; use Illuminate\Database\Eloquent\Model; use Illuminate\Database\Eloquent\Relations\BelongsTo; use Illuminate\Database\Eloquent\Relations\HasMany;
class Post extends Model { use HasFactory; protected $fillable=['user_id','title','body']; public function user(): BelongsTo { return $this->belongsTo(User::class); } public function comments(): HasMany { return $this->hasMany(Comment::class); } public function scopeWithUser($q){ return $q->with('user'); } public function commentsCount(){ return $this->comments()->count(); } }
PHP
  cat > app/Models/Comment.php <<'PHP'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory; use Illuminate\Database\Eloquent\Model; use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Comment extends Model { use HasFactory; protected $fillable=['post_id','body']; public function post(): BelongsTo { return $this->belongsTo(Post::class); } }
PHP

  info "Write REST controllers"
  cat > app/Http/Controllers/PostController.php <<'PHP'
<?php
namespace App\Http\Controllers; use App\Models\Post; use App\Http\Resources\PostResource; use Illuminate\Http\Request;
class PostController extends Controller { public function index(){ return PostResource::collection(Post::with('user')->latest()->paginate(10)); } public function show(Post $post){ $post->load(['user','comments']); return new PostResource($post); } public function store(Request $request){ $data=$request->validate(['title'=>'required|string|max:255','body'=>'required|string']); $userId=\App\Models\User::query()->value('id') ?? \App\Models\User::factory()->create()->id; $post=Post::create(['user_id'=>$userId]+$data); return new PostResource($post->load(['user','comments'])); } public function update(Request $request, Post $post){ $data=$request->validate(['title'=>'sometimes|string|max:255','body'=>'sometimes|string']); $post->update($data); return new PostResource($post->fresh()->load(['user','comments'])); } public function destroy(Post $post){ $post->delete(); return response()->noContent(); } }
PHP
  cat > app/Http/Controllers/CommentController.php <<'PHP'
<?php
namespace App\Http\Controllers; use App\Models\Post; use App\Http\Resources\CommentResource; use Illuminate\Http\Request;
class CommentController extends Controller { public function index(Post $post){ return CommentResource::collection($post->comments()->latest()->paginate(10)); } public function store(Request $request, Post $post){ $data=$request->validate(['body'=>'required|string']); $comment=$post->comments()->create($data); return new CommentResource($comment); } }
PHP

  info "Write API resources"
  cat > app/Http/Resources/PostResource.php <<'PHP'
<?php
namespace App\Http\Resources; use Illuminate\Http\Request; use Illuminate\Http\Resources\Json\JsonResource;
class PostResource extends JsonResource { public function toArray(Request $request): array { return ['id'=>$this->id,'title'=>$this->title,'body'=>$this->body,'user'=>['id'=>$this->user->id??null,'name'=>$this->user->name??null],'comments_count'=>$this->comments()->count(),'created_at'=>$this->created_at]; } }
PHP
  cat > app/Http/Resources/CommentResource.php <<'PHP'
<?php
namespace App\Http\Resources; use Illuminate\Http\Request; use Illuminate\Http\Resources\Json\JsonResource;
class CommentResource extends JsonResource { public function toArray(Request $request): array { return ['id'=>$this->id,'body'=>$this->body,'post_id'=>$this->post_id,'created_at'=>$this->created_at]; } }
PHP

  info "Define REST routes"
  cat > routes/api.php <<'PHP'
<?php
use Illuminate\Support\Facades\Route; use App\Http\Controllers\PostController; use App\Http\Controllers\CommentController;
Route::get('/posts',[PostController::class,'index']); Route::post('/posts',[PostController::class,'store']); Route::get('/posts/{post}',[PostController::class,'show']); Route::put('/posts/{post}',[PostController::class,'update']); Route::delete('/posts/{post}',[PostController::class,'destroy']); Route::get('/posts/{post}/comments',[CommentController::class,'index']); Route::post('/posts/{post}/comments',[CommentController::class,'store']);
PHP

  info "GraphQL schema"
  mkdir -p graphql app/GraphQL/Mutations
  cat > graphql/schema.graphql <<'GQL'
type Query { posts(first: Int! = 10, page: Int): PostPaginator @paginate(model: "App\\Models\\Post", type: "paginator", scopes: ["withUser"]) post(id: ID!): Post @find(model: "App\\Models\\Post") }
type Mutation { createPost(title: String!, body: String!): Post @field(resolver: "App\\GraphQL\\Mutations\\CreatePost") addComment(post_id: ID!, body: String!): Comment @create(model: "App\\Models\\Comment") updatePost(id: ID!, title: String, body: String): Post @field(resolver: "App\\GraphQL\\Mutations\\UpdatePost") deletePost(id: ID!): Boolean @field(resolver: "App\\GraphQL\\Mutations\\DeletePost") }
type Post { id: ID! title: String! body: String! user: User! @belongsTo comments: [Comment!]! @hasMany comments_count: Int! @method(name: "commentsCount") created_at: DateTime! }
type Comment { id: ID! body: String! post: Post! @belongsTo created_at: DateTime! }
type User { id: ID! name: String! posts: [Post!]! @hasMany }
type PostPaginator { data: [Post!]! paginatorInfo: PaginatorInfo! }
GQL

  cat > app/GraphQL/Mutations/CreatePost.php <<'PHP'
<?php
namespace App\GraphQL\Mutations; use App\Models\Post;
class CreatePost { public function __invoke($_, array $args){ $userId=\App\Models\User::query()->value('id') ?? \App\Models\User::factory()->create()->id; return Post::create(['user_id'=>$userId,'title'=>$args['title'],'body'=>$args['body']]); } }
PHP
  cat > app/GraphQL/Mutations/UpdatePost.php <<'PHP'
<?php
namespace App\GraphQL\Mutations; use App\Models\Post;
class UpdatePost { public function __invoke($_, array $args){ $post=Post::findOrFail($args['id']); $data=[]; if(array_key_exists('title',$args)) $data['title']=$args['title']; if(array_key_exists('body',$args)) $data['body']=$args['body']; $post->update($data); return $post->fresh(); } }
PHP
  cat > app/GraphQL/Mutations/DeletePost.php <<'PHP'
<?php
namespace App\GraphQL\Mutations; use App\Models\Post;
class DeletePost { public function __invoke($_, array $args){ $post=Post::findOrFail($args['id']); return (bool)$post->delete(); } }
PHP

  info "Seeders and factories"
  php artisan make:seeder DemoSeeder
  cat > database/seeders/DemoSeeder.php <<'PHP'
<?php
namespace Database\Seeders; use Illuminate\Database\Seeder; use App\Models\User; use App\Models\Post; use App\Models\Comment;
class DemoSeeder extends Seeder { public function run(): void { $users=User::factory()->count(3)->sequence(['name'=>'Ada Lovelace'],['name'=>'Alan Turing'],['name'=>'Grace Hopper'])->create(); $users->each(function($user){ Post::factory()->count(7)->create(['user_id'=>$user->id])->each(function($post){ $count=rand(0,5); if($count>0){ Comment::factory()->count($count)->create(['post_id'=>$post->id]); } }); }); } }
PHP
  php artisan make:seeder MoreDataSeeder
  cat > database/seeders/MoreDataSeeder.php <<'PHP'
<?php
namespace Database\Seeders; use Illuminate\Database\Seeder; use App\Models\User; use App\Models\Post; use App\Models\Comment;
class MoreDataSeeder extends Seeder { public function run(): void { if(User::count()<5){ User::factory()->count(2)->create(); } $userIds=User::pluck('id'); Post::factory()->count(50)->create(function() use($userIds){ return ['user_id'=>$userIds->random()]; })->each(function($post){ Comment::factory()->count(rand(1,6))->create(['post_id'=>$post->id]); }); } }
PHP

  php artisan make:factory PostFactory --model=Post
  cat > database/factories/PostFactory.php <<'PHP'
<?php
namespace Database\Factories; use Illuminate\Database\Eloquent\Factories\Factory;
class PostFactory extends Factory { public function definition(): array { return ['title'=>fake()->sentence(6),'body'=>fake()->paragraphs(3,true)]; } }
PHP
  php artisan make:factory CommentFactory --model=Comment
  cat > database/factories/CommentFactory.php <<'PHP'
<?php
namespace Database\Factories; use Illuminate\Database\Eloquent\Factories\Factory;
class CommentFactory extends Factory { public function definition(): array { return ['body'=>fake()->sentence(12)]; } }
PHP

  info "Migrate and seed"
  php artisan migrate --force
  php artisan db:seed --class=DemoSeeder --force
  ok "Laravel backend ready in $TARGET_DIR"
}

main "$@"
