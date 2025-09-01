#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR=${1:-client}

color() { printf "\033[%sm%s\033[0m\n" "$1" "$2"; }
info() { color 36 "[client] $1"; }
ok() { color 32 "[client] $1"; }
warn() { color 33 "[client] $1"; }
err() { color 31 "[client] $1"; }

setup_react() {
  info "Creating React + Vite app in $TARGET_DIR"
  if [ -d "$TARGET_DIR" ]; then
    warn "$TARGET_DIR exists; skipping vite scaffolding"
  else
    mkdir -p "$TARGET_DIR"
    (cd "$TARGET_DIR" && npm create vite@latest . -- --template react)
  fi
  cd "$TARGET_DIR"

  info "Installing dependencies (axios, Apollo, GraphQL, Tailwind)"
  npm i axios @apollo/client graphql react-router-dom
  npm i -D tailwindcss postcss autoprefixer
  # Manually create Tailwind + PostCSS configs to avoid npx issues in paths with spaces
  cat > tailwind.config.js <<'JS'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
JS
  cat > postcss.config.js <<'JS'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
JS

  info "Configuring Tailwind"
  sed -i.bak "s/content: \[\]/content: ['.\\/index.html', '.\\/src\\/**/*.{js,ts,jsx,tsx}']/" tailwind.config.js || true
  cat > src/index.css <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
body { @apply bg-slate-50 text-slate-900; }
CSS

  info "Environment config"
  cat > .env <<'ENV'
VITE_API_URL=http://localhost:8000
VITE_GQL_URL=http://localhost:8000/graphql
ENV

  info "App boilerplate (Apollo + axios + UI)"
  mkdir -p src/components src/pages src/lib

  # UI helpers
  cat > src/components/Spinner.tsx <<'TSX'
import React from 'react';

export function Spinner() {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <svg className="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span>Loading…</span>
    </div>
  );
}
TSX

  cat > src/components/ErrorBanner.tsx <<'TSX'
import React from 'react';

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded">
      {message}
    </div>
  );
}
TSX

  # Toast notifications
  cat > src/components/Toaster.tsx <<'TSX'
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string };

const ToastCtx = createContext<{ notify: (t: Omit<Toast,'id'>) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = useCallback((t: Omit<Toast,'id'>) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, ...t }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3000);
  }, []);
  const value = useMemo(() => ({ notify }), [notify]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-2 rounded shadow text-white ${t.type==='success' ? 'bg-green-600' : t.type==='error' ? 'bg-red-600' : 'bg-slate-800'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
TSX

  cat > src/lib/api.ts <<'TS'
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({ baseURL: `${baseURL}/api` });
TS

  cat > src/lib/apollo.ts <<'TS'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const uri = import.meta.env.VITE_GQL_URL || 'http://localhost:8000/graphql';

export const apollo = new ApolloClient({
  link: new HttpLink({ uri }),
  cache: new InMemoryCache(),
});
TS

  cat > src/components/Toggle.tsx <<'TSX'
import React from 'react';

type Mode = 'rest' | 'graphql';

export function Toggle({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        className={`px-4 py-2 text-sm font-medium border ${mode==='rest' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800'} rounded-l-lg`}
        onClick={() => setMode('rest')}
      >REST</button>
      <button
        className={`px-4 py-2 text-sm font-medium border ${mode==='graphql' ? 'bg-purple-600 text-white' : 'bg-white text-slate-800'} rounded-r-lg`}
        onClick={() => setMode('graphql')}
      >GraphQL</button>
    </div>
  );
}
TSX

  cat > src/pages/Posts.tsx <<'TSX'
import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { gql, useQuery, ApolloProvider } from '@apollo/client';
import { apollo } from '../lib/apollo';
import { Link } from 'react-router-dom';
import { Spinner } from '../components/Spinner';
import { ErrorBanner } from '../components/ErrorBanner';

type Mode = 'rest' | 'graphql';

const POSTS = gql`
  query Posts($first: Int, $page: Int) {
    posts(first: $first, page: $page) {
      data { id title body user { id name } comments_count created_at }
      paginatorInfo { currentPage lastPage hasMorePages }
    }
  }
`;

function GraphQLList() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery(POSTS, {
    variables: { first: 10, page },
    fetchPolicy: 'cache-and-network',
  });
  if (loading && !data) return <Spinner />;
  if (error) return <ErrorBanner message={error.message} />;
  const posts = data?.posts?.data ?? [];
  const info = data?.posts?.paginatorInfo;
  return (
    <>
      <ul className="space-y-3">
        {posts.map((p: any) => (
          <li key={p.id} className="p-4 bg-white rounded border">
            <h3 className="font-semibold text-lg">
              <Link className="text-blue-600 hover:underline" to={`/posts/${p.id}`}>{p.title}</Link>
            </h3>
            <p className="text-sm text-slate-600">by {p.user?.name ?? 'Unknown'}</p>
            <p className="mt-2">{p.body}</p>
            <p className="mt-2 text-xs text-slate-500">{p.comments_count} comments</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-3">
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >Prev</button>
        <span className="text-sm text-slate-600">Page {info?.currentPage ?? page} of {info?.lastPage ?? '…'}</span>
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage(p => p + 1)}
          disabled={!info?.hasMorePages}
        >Next</button>
      </div>
    </>
  );
}

function RestList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get(`/posts?page=${page}`).then(r => {
      if (!mounted) return;
      setPosts(r.data.data || []);
      setMeta(r.data.meta || null);
      setLoading(false);
    }).catch(e => { setError(e.message); setLoading(false); });
    return () => { mounted = false; };
  }, [page]);

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;

  const current = meta?.current_page ?? page;
  const last = meta?.last_page ?? page;
  const hasPrev = current > 1;
  const hasNext = current < last;

  return (
    <>
      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.id} className="p-4 bg-white rounded border">
            <h3 className="font-semibold text-lg">
              <Link className="text-blue-600 hover:underline" to={`/posts/${p.id}`}>{p.title}</Link>
            </h3>
            <p className="text-sm text-slate-600">by {p.user?.name ?? 'Unknown'}</p>
            <p className="mt-2">{p.body}</p>
            <p className="mt-2 text-xs text-slate-500">{p.comments_count} comments</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-3">
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={!hasPrev}
        >Prev</button>
        <span className="text-sm text-slate-600">Page {current} of {last}</span>
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage(p => p + 1)}
          disabled={!hasNext}
        >Next</button>
      </div>
    </>
  );
}

export function PostsPage({ mode }: { mode: Mode }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Posts</h2>
        <Link to="/new" className="px-3 py-2 rounded bg-green-600 text-white text-sm">New Post</Link>
      </div>
      {mode === 'rest' ? (
        <RestList />
      ) : (
        <ApolloProvider client={apollo}>
          <GraphQLList />
        </ApolloProvider>
      )}
    </div>
  );
}
TSX

  cat > src/pages/PostDetail.tsx <<'TSX'
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { gql, useMutation, useQuery, ApolloProvider } from '@apollo/client';
import { apollo } from '../lib/apollo';
import { Spinner } from '../components/Spinner';
import { ErrorBanner } from '../components/ErrorBanner';
import { useToast } from '../components/Toaster';

type Mode = 'rest' | 'graphql';

const POST_Q = gql`
  query Post($id: ID!) {
    post(id: $id) {
      id
      title
      body
      user { id name }
      comments { id body created_at }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($post_id: ID!, $body: String!) {
    addComment(post_id: $post_id, body: $body) { id body }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) { deletePost(id: $id) }
`;

function GraphQLDetail() {
  const { id } = useParams();
  const { data, loading, error, refetch } = useQuery(POST_Q, { variables: { id } });
  const [body, setBody] = useState('');
  const { notify } = useToast();
  const [addComment, { loading: saving }] = useMutation(ADD_COMMENT, {
    optimisticResponse: ({ body }) => ({ addComment: { __typename: 'Comment', id: `temp-${Date.now()}`, body } }),
    update(cache, { data }) {
      if (!data?.addComment) return;
      const existing: any = cache.readQuery({ query: POST_Q, variables: { id } });
      if (!existing?.post) return;
      const next = { ...existing, post: { ...existing.post, comments: [...(existing.post.comments||[]), data.addComment] } };
      cache.writeQuery({ query: POST_Q, variables: { id }, data: next });
    },
    onError(err){ notify({ type: 'error', message: err.message }); },
    onCompleted(){ notify({ type: 'success', message: 'Comment added' }); }
  });
  const [deletePost, { loading: deleting }] = useMutation(DELETE_POST, {
    optimisticResponse: { deletePost: true },
    update(cache){ cache.evict({ id: cache.identify({ __typename:'Post', id }) }); cache.gc(); },
    onError(err){ notify({ type: 'error', message: err.message }); },
  });

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error.message} />;
  const p = data?.post;
  if (!p) return <p>Not found</p>;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addComment({ variables: { post_id: id, body } });
    setBody('');
    // cache already updated optimistically; optionally refetch
    // await refetch();
  };

  const onDelete = async () => {
    if (!confirm('Delete this post?')) return;
    await deletePost({ variables: { id } });
    notify({ type: 'success', message: 'Post deleted' });
    window.location.href = '/';
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold">{p.title}</h2>
      <p className="text-sm text-slate-600">by {p.user?.name ?? 'Unknown'}</p>
      <p className="mt-4">{p.body}</p>

      <div className="mt-4 flex gap-2">
        <a href={`/posts/${p.id}/edit`} className="px-3 py-2 bg-amber-500 text-white rounded text-sm">Edit</a>
        <button onClick={onDelete} disabled={deleting} className="px-3 py-2 bg-red-600 text-white rounded text-sm disabled:opacity-50">Delete</button>
      </div>

      <h3 className="mt-8 font-semibold">Comments</h3>
      <ul className="space-y-2 mt-2">
        {p.comments?.map((c: any) => (
          <li key={c.id} className="p-3 bg-white border rounded">{c.body}</li>
        ))}
      </ul>

      <form onSubmit={onSubmit} className="mt-6 space-y-2">
        <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full border rounded p-2" placeholder="Write a comment" />
        <button disabled={saving || !body.trim()} className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Add Comment</button>
      </form>
    </div>
  );
}

function RestDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { notify } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const [p, c] = await Promise.all([
        api.get(`/posts/${id}`),
        api.get(`/posts/${id}/comments`),
      ]);
      setPost(p.data);
      setComments(c.data.data || []);
      setLoading(false);
    } catch (e: any) { setError(e.message); setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post(`/posts/${id}/comments`, { body });
      setBody('');
      await load();
      notify({ type: 'success', message: 'Comment added' });
    } finally { setSaving(false); }
  };

  const onDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      setDeleting(true);
      await api.delete(`/posts/${id}`);
      notify({ type: 'success', message: 'Post deleted' });
      window.location.href = '/';
    } finally { setDeleting(false); }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;
  if (!post) return <p>Not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold">{post.title}</h2>
      <p className="text-sm text-slate-600">by {post.user?.name ?? 'Unknown'}</p>
      <p className="mt-4">{post.body}</p>

      <div className="mt-4 flex gap-2">
        <a href={`/posts/${post.id}/edit`} className="px-3 py-2 bg-amber-500 text-white rounded text-sm">Edit</a>
        <button onClick={onDelete} disabled={deleting} className="px-3 py-2 bg-red-600 text-white rounded text-sm disabled:opacity-50">Delete</button>
      </div>

      <h3 className="mt-8 font-semibold">Comments</h3>
      <ul className="space-y-2 mt-2">
        {comments.map((c: any) => (
          <li key={c.id} className="p-3 bg-white border rounded">{c.body}</li>
        ))}
      </ul>

      <form onSubmit={onSubmit} className="mt-6 space-y-2">
        <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full border rounded p-2" placeholder="Write a comment" />
        <button disabled={saving || !body.trim()} className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Add Comment</button>
      </form>
    </div>
  );
}

export function PostDetailPage({ mode }: { mode: Mode }) {
  return mode === 'rest' ? <RestDetail /> : (
    <ApolloProvider client={apollo}>
      <GraphQLDetail />
    </ApolloProvider>
  );
}
TSX

  cat > src/pages/EditPost.tsx <<'TSX'
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { gql, useMutation, useQuery, ApolloProvider } from '@apollo/client';
import { apollo } from '../lib/apollo';
import { Spinner } from '../components/Spinner';
import { ErrorBanner } from '../components/ErrorBanner';
import { useToast } from '../components/Toaster';

type Mode = 'rest' | 'graphql';

const POST_Q = gql`query Post($id: ID!) { post(id: $id) { id title body } }`;
const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String, $body: String) {
    updatePost(id: $id, title: $title, body: $body) { id }
  }
`;

function RestEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    let mounted = true;
    api.get(`/posts/${id}`).then(r => {
      if (!mounted) return;
      setTitle(r.data.title);
      setBody(r.data.body);
      setLoading(false);
    }).catch(e => { setError(e.message); setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put(`/posts/${id}`, { title, body });
      nav(`/posts/${id}`);
      notify({ type: 'success', message: 'Post updated' });
    } finally { setSaving(false); }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded p-2" placeholder="Title" />
      <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full border rounded p-2" placeholder="Body" rows={6} />
      <button disabled={saving || !title.trim() || !body.trim()} className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Save</button>
    </form>
  );
}

function GraphQLEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, loading, error } = useQuery(POST_Q, { variables: { id } });
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { notify } = useToast();
  const [updatePost, { loading: saving }] = useMutation(UPDATE_POST, {
    optimisticResponse: ({ id, title, body }) => ({ updatePost: { __typename: 'Post', id, title, body } }),
    update(cache, { data }) {
      if (!data?.updatePost) return;
      cache.writeQuery({ query: POST_Q, variables: { id }, data: { post: data.updatePost } });
    },
    onError(err){ notify({ type: 'error', message: err.message }); },
  });

  useEffect(() => {
    if (data?.post) {
      setTitle(data.post.title);
      setBody(data.post.body);
    }
  }, [data]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePost({ variables: { id, title, body } });
    nav(`/posts/${id}`);
    notify({ type: 'success', message: 'Post updated' });
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error.message} />;

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded p-2" placeholder="Title" />
      <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full border rounded p-2" placeholder="Body" rows={6} />
      <button disabled={saving || !title.trim() || !body.trim()} className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Save</button>
    </form>
  );
}

export function EditPostPage({ mode }: { mode: Mode }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      {mode === 'rest' ? (
        <RestEditor />
      ) : (
        <ApolloProvider client={apollo}>
          <GraphQLEditor />
        </ApolloProvider>
      )}
    </div>
  );
}
TSX

  cat > src/pages/CreatePost.tsx <<'TSX'
import React, { useState } from 'react';
import { api } from '../lib/api';
import { gql, useMutation, ApolloProvider } from '@apollo/client';
import { apollo } from '../lib/apollo';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toaster';

type Mode = 'rest' | 'graphql';

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!) {
    createPost(title: $title, body: $body) { id }
  }
`;

function RestForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();
  const { notify } = useToast();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.post('/posts', { title, body });
      nav(`/posts/${res.data.id}`);
      notify({ type: 'success', message: 'Post created' });
    } finally { setSaving(false); }
  };
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded p-2" placeholder="Title" />
      <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full border rounded p-2" placeholder="Body" rows={6} />
      <button disabled={saving || !title.trim() || !body.trim()} className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50">Create</button>
    </form>
  );
}

function GraphQLForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { notify } = useToast();
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    optimisticResponse: ({ title, body }) => ({ createPost: { __typename: 'Post', id: `temp-${Date.now()}`, title, body } }),
    onError(err){ notify({ type: 'error', message: err.message }); },
  });
  const nav = useNavigate();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createPost({ variables: { title, body } });
    const id = res.data?.createPost?.id;
    if (id) nav(`/posts/${id}`);
    notify({ type: 'success', message: 'Post created' });
  };
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded p-2" placeholder="Title" />
      <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full border rounded p-2" placeholder="Body" rows={6} />
      <button disabled={loading || !title.trim() || !body.trim()} className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50">Create</button>
    </form>
  );
}

export function CreatePostPage({ mode }: { mode: Mode }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">New Post</h2>
      {mode === 'rest' ? (
        <RestForm />
      ) : (
        <ApolloProvider client={apollo}>
          <GraphQLForm />
        </ApolloProvider>
      )}
    </div>
  );
}
TSX

  cat > src/App.jsx <<'JSX'
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
JSX

  cat > src/main.jsx <<'JSX'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastProvider } from './components/Toaster.tsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
)
JSX

  ok "React frontend ready in $TARGET_DIR"
}

setup_react
