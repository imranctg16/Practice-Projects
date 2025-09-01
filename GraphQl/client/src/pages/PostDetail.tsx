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
