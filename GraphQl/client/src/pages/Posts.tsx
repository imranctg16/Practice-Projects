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
