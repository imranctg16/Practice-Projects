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
