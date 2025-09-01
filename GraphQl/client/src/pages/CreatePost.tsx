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
