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
