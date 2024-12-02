'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts and people..."
            className="w-full bg-gray-900 rounded-full py-2 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-2.5 text-gray-400" />
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 