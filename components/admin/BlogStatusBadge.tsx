import React from 'react';
import { BlogStatus } from '@/lib/types';

export function BlogStatusBadge({ status }: { status: BlogStatus }) {
  const styles: Record<string, string> = {
    published: 'bg-green-100 text-green-800 border-green-200',
    draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    archived: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const labels: Record<string, string> = {
    published: 'Published',
    draft: 'Draft',
    archived: 'Archived',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-red-100 text-red-800 border-red-200'}`}>
      {labels[status] || 'Unknown'}
    </span>
  );
}
