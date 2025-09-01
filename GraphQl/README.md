Laravel + React GraphQL/REST Demo (with Tailwind)

This repo contains scripts to generate a full-stack demo that exposes the same data over REST and GraphQL, and a React UI (Tailwind styled) that can switch between both to compare.

What you get
- Backend: Laravel API with Eloquent models (User, Post, Comment), REST controllers/resources, GraphQL endpoint via Lighthouse.
- Frontend: React + Vite + Tailwind, REST via axios, GraphQL via Apollo Client, UI toggle between protocols.
- DB: SQLite for easy local use, with seed data.
- UI: Posts list, post detail with comments, and create-post form for both REST and GraphQL.
 - UX: Toast notifications for actions and optimistic UI for GraphQL (comments, update/delete; create navigates immediately with notification).

Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm or pnpm (scripts assume `npm`)
- bash (for running the setup scripts)

Quick start
1) Generate the full project (server + client) in this folder:
   `./scripts/setup.sh`

2) Start backend (from `server/`):
   `php artisan serve`

3) Start frontend (from `client/`):
   `npm run dev`

4) Open the app:
   http://localhost:5173

The frontend expects the Laravel server at http://localhost:8000.

Structure after setup
- `server/`  — Laravel app (REST + GraphQL)
- `client/`  — React + Vite + Tailwind (REST + Apollo)

Notes
- For demo simplicity, reads are public; writes are unauthenticated and associate with a seeded demo user.
- Intended for local/demo use. Review CORS and GraphQL depth/complexity settings before deploying.
 - Optional: seed more data later with `php artisan db:seed --class=MoreDataSeeder` in `server/`.

Features to explore
- Toggle REST/GraphQL at the top right.
- Posts list links to detail pages and includes pagination controls.
- Post detail shows comments and lets you add one.
- Create, edit, and delete posts; edit opens a pre-filled form.
 - Optimistic UI: Add a comment in GraphQL mode to see instant UI update.

Verify from API directly
- REST:
  - List posts: GET http://localhost:8000/api/posts
  - One post: GET http://localhost:8000/api/posts/1
  - Create post: POST http://localhost:8000/api/posts with JSON {"title":"Hello","body":"World"}
  - Post comments: GET http://localhost:8000/api/posts/1/comments
  - Add comment: POST http://localhost:8000/api/posts/1/comments with JSON {"body":"Nice post"}
- GraphQL (POST http://localhost:8000/graphql):
  - Query posts:
    query { posts(first: 10) { data { id title user { name } comments_count } } }
  - Query post:
    query { post(id: 1) { id title body user { name } comments { id body } } }
  - Create post:
    mutation { createPost(title: "Hi", body: "There") { id title } }
  - Add comment:
    mutation { addComment(post_id: 1, body: "Nice") { id body } }

Troubleshooting
- If composer/npm install fails, ensure network access and correct versions.
- If GraphQL throws N+1 warnings, Lighthouse directives already eager-load relations in queries used by the UI.
- If ports conflict, adjust `php artisan serve --port=8001` and update client env `VITE_API_URL` / `VITE_GQL_URL` accordingly.
 - UI: Loading uses a simple spinner and errors display in a non-blocking banner.
