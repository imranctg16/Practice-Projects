import React, { useState } from 'react';
import { Toggle } from './components/Toggle';
import { PostsPage } from './pages/Posts';
import { PostDetailPage } from './pages/PostDetail';
import { EditPostPage } from './pages/EditPost';
import { CreatePostPage } from './pages/CreatePost';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

export default function App() {
  const [mode, setMode] = useState('rest');
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <header className="border-b bg-white">
          <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
            <Link to="/" className="text-xl font-semibold">GraphQL vs REST Demo</Link>
            <Toggle mode={mode} setMode={(m) => setMode(m)} />
          </div>
        </header>
        <main className="py-6">
          <Routes>
            <Route path="/" element={<PostsPage mode={mode as any} />} />
            <Route path="/new" element={<CreatePostPage mode={mode as any} />} />
            <Route path="/posts/:id" element={<PostDetailPage mode={mode as any} />} />
            <Route path="/posts/:id/edit" element={<EditPostPage mode={mode as any} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
