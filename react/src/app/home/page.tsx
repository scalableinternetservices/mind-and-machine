'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import PostList from '@/components/post/PostList';
import { Post } from '@/types';
import SearchBar from '@/components/SearchBar';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { postService } from '@/services/post';
import { AxiosError } from 'axios';

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const fetchPosts = async () => {
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError('Failed to fetch posts');
      }
      console.error('Error fetching posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const userId = parseInt(localStorage.getItem('userId') || '0');
    setCurrentUserId(userId);
  }, []);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const createdPost = await postService.createPost(newPost);
      console.log('Created post:', createdPost);
      setPosts([createdPost, ...posts]); // set new post to the first of the list
      setNewPost('');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError('Failed to create post');
      }
      console.error('Error creating post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <Layout>
      {/* Fixed header with title and search bar */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur">
        <div className="border-b border-gray-800 p-4">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
        <div className="border-b border-gray-800">
          <SearchBar />
        </div>
      </div>

      {/* Post creation area */}
      <div className="border-b border-gray-800 p-4">
        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmitPost}>
          <div className="flex space-x-4">
            <UserCircleIcon className="w-12 h-12 text-gray-400" />
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's happening?"
                className="w-full bg-transparent text-xl placeholder-gray-500 border-none focus:ring-0 resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-4">
                <button
                  type="submit"
                  disabled={!newPost.trim() || isLoading}
                  className="bg-blue-500 text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {isLoading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Posts list */}
      <PostList 
        posts={posts} 
        currentUserId={currentUserId} 
        onPostUpdate={handlePostUpdate}
        onPostDelete={handlePostDelete}
      />
    </Layout>
  );
};

export default HomePage; 