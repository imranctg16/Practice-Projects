import React from 'react';

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded">
      {message}
    </div>
  );
}
