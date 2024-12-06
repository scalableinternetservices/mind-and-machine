'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/types';
import { postService } from '@/services/post';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Layout from '@/components/layout/Layout';
import PostCard from '@/components/post/PostCard';
import { useParams } from 'next/navigation';

type Tab = 'posts' | 'likes';

const UserProfilePage = () => {
  const { id } = useParams();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [joinedDate, setJoinedDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentId = parseInt(localStorage.getItem('userId') || '0');
    setCurrentUserId(currentId);
    const currentUserName = localStorage.getItem('username');
    setUsername(currentUserName);
    const joinedAt = localStorage.getItem('joined_at');
    setJoinedDate(joinedAt);

    if (id) {
      fetchUserData(id as number);
    }
  }, [id]);

  // listen to activeTab change
  useEffect(() => {
    if (id) {
      fetchUserData(id as number);
    }
  }, [activeTab]);

  const fetchUserData = async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = activeTab === 'posts'
        ? await postService.getUserPosts(userId)
        : await postService.getLikedPosts(userId);
      
      // make sure likes is an array of integers
      const postsWithIntLikes = data.map((post: Post) => ({
        ...post,
        likes: post.likes.map(like => parseInt(like))
      }));
      
      setPosts(postsWithIntLikes);
    } catch (err: any) {
      setError('Failed to fetch user data');
      console.error('Error fetching user data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(posts.map((post: Post) =>
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId: number) => {
    setPosts(posts.filter((post: Post) => post.id !== postId));
  };

  if (error) {
    return (
      <Layout>
        <div className="text-red-500 p-4">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <UserCircleIcon className="w-20 h-20 text-gray-400" />
            <div>
              <h1 className="text-2xl font-bold">{username}</h1>
              {joinedDate && !isNaN(new Date(joinedDate).getTime()) && (
                <div className="flex items-center text-gray-500 mt-2">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  <span>
                    Joined {formatDistanceToNow(new Date(joinedDate), {
                      locale: enUS,
                      addSuffix: true
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-800">
          <button
            className={`flex-1 py-4 text-center hover:bg-gray-900 transition ${
              activeTab === 'posts' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
            }`}
            onClick={() => handleTabChange('posts')}
          >
            Posts
          </button>
          <button
            className={`flex-1 py-4 text-center hover:bg-gray-900 transition ${
              activeTab === 'likes' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
            }`}
            onClick={() => handleTabChange('likes')}
          >
            Likes
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500">Loading...</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onUpdate={handlePostUpdate}
                onDelete={handlePostDelete}
              />
            ))}
            {posts.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                {activeTab === 'posts' ? 'No posts yet' : 'No liked posts yet'}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 

export default UserProfilePage;