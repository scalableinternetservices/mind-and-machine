'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Post, User } from '@/types';
import { postService } from '@/services/post';
import PostList from '@/components/post/PostList';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const userId = parseInt(localStorage.getItem('userId') || '0');
    setCurrentUserId(userId);
  }, []);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const [postsResults, usersResults] = await Promise.all([
        postService.searchPosts(query),
        postService.searchUsers(query)
      ]);
      setPosts(postsResults);
      setUsers(usersResults);
    } catch (err: any) {
      setError('Search failed');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(currentPosts => 
      currentPosts.map(post => post.id === updatedPost.id ? updatedPost : post)
    );
  };

  const handlePostDelete = (postId: number) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">Search results for "{query}"</h1>
        </div>

        <Tab.Group>
          <Tab.List className="flex border-b border-gray-800">
            <Tab className={({ selected }) => clsx(
              'flex-1 py-4 text-sm text-center focus:outline-none transition-all',
              selected 
                ? 'text-blue-500 border-b-2 border-blue-500 font-bold'
                : 'text-gray-500 hover:text-gray-300 font-normal'
            )}>
              Posts
            </Tab>
            <Tab className={({ selected }) => clsx(
              'flex-1 py-4 text-sm text-center focus:outline-none transition-all',
              selected 
                ? 'text-blue-500 border-b-2 border-blue-500 font-bold'
                : 'text-gray-500 hover:text-gray-300 font-normal'
            )}>
              People
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              {posts.length > 0 ? (
                <PostList 
                  posts={posts}
                  currentUserId={currentUserId}
                  onPostUpdate={handlePostUpdate}
                  onPostDelete={handlePostDelete}
                />
              ) : (
                <div className="p-4 text-gray-500 text-center">
                  No posts found
                </div>
              )}
            </Tab.Panel>
            <Tab.Panel>
              <div className="divide-y divide-gray-800">
                {users.map(user => (
                  <Link 
                    key={user.id} 
                    href={`/user/${user.id}`}
                    className="flex items-center space-x-3 p-4 hover:bg-gray-900/50 transition"
                  >
                    <UserCircleIcon className="w-12 h-12 text-gray-400" />
                    <div>
                      <div className="font-bold hover:underline">
                        {user.username}
                      </div>
                      <div className="text-gray-500">
                        Joined {formatDistanceToNow(new Date(user.created_at), {
                          locale: enUS,
                          addSuffix: true
                        })}
                      </div>
                    </div>
                  </Link>
                ))}
                {users.length === 0 && (
                  <div className="p-4 text-gray-500 text-center">
                    No users found
                  </div>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Layout>
  );
};

export default SearchPage; 