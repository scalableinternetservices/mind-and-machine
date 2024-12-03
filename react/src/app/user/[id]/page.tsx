'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Post } from '@/types';
import { postService } from '@/services/post';
import { UserCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import PostList from '@/components/post/PostList';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { useParams } from 'next/navigation';

const UserProfilePage = () => {
  const { id } = useParams();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number| null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [joinedDate, setJoinedDate] = useState<string | null>(null);

  useEffect(() => {
    const currentId = parseInt(localStorage.getItem('userId') || '0');
    setCurrentUserId(currentId);
    const cuurentUserName = localStorage.getItem('username');
    setUsername(cuurentUserName);
    const joinedAt = localStorage.getItem('joined_at');
    setJoinedDate(joinedAt);

    if (id) {
      fetchUserData(id as number);
    }
  }, [id]);

  const fetchUserData = async (userId: number) => {
    setIsLoading(true);
    try {
      const [posts, liked] = await Promise.all([
        postService.getUserPosts(userId),
        postService.getLikedPosts(userId)
      ]);
      
      const postsWithIntLikes = posts.map(post => ({
        ...post,
        likes: post.likes.map(like => parseInt(like))
      }));
      
      const likedWithIntLikes = liked.map(post => ({
        ...post,
        likes: post.likes.map(like => parseInt(like))
      }));

      setUserPosts(postsWithIntLikes);
      setLikedPosts(likedWithIntLikes);
    } catch (err: any) {
      setError('Failed to fetch user data');
      console.error('Error fetching user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setUserPosts(posts => posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
    setLikedPosts(posts => posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId: number) => {
    setUserPosts(posts => posts.filter(post => post.id !== postId));
    setLikedPosts(posts => posts.filter(post => post.id !== postId));
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
              Likes
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <PostList 
                posts={userPosts} 
                currentUserId={currentUserId}
                onPostUpdate={handlePostUpdate}
                onPostDelete={handlePostDelete}
              />
            </Tab.Panel>
            <Tab.Panel>
              <PostList 
                posts={likedPosts}
                currentUserId={currentUserId}
                onPostUpdate={handlePostUpdate}
                onPostDelete={handlePostDelete}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Layout>
  );
};

export default UserProfilePage; 