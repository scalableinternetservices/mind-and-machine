'use client';

import { useEffect, useState } from 'react';
import { Post, Comment } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ChatBubbleLeftIcon, HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import CommentList from '@/components/comment/CommentList';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { postService } from '@/services/post';

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const router = useRouter();

  const fetchPost = async () => {
    try {
      const data = await postService.getPost(parseInt(id));
      setPost(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
        return;
      }
      setError('Failed to fetch post');
      console.error('Error fetching post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    const userId = parseInt(localStorage.getItem('userId') || '0');
    setCurrentUserId(userId);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500">{error || 'Post not found'}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Link href="/home" className="flex items-center space-x-2 text-gray-400 hover:text-white">
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back</span>
          </Link>
        </div>
        <div className="p-4">
          <div className="flex space-x-3">
            <UserCircleIcon className="w-12 h-12 text-gray-400" />
            <div className="flex-1">
              <div className="flex flex-col">
                <span className="text-gray-500">@{post.user.username}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xl">{post.content}</p>
          <div className="mt-4 text-gray-500">
            {formatDistanceToNow(new Date(post.created_at), { locale: enUS, addSuffix: true })}
          </div>
          <div className="flex items-center space-x-8 mt-4 py-4 border-y border-gray-800">
            <div className="flex items-center space-x-2 text-gray-500">
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span>{post.comments.length}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <HeartIcon className="w-5 h-5" />
              <span>{post.likes.length}</span>
            </div>
          </div>
        </div>
        <CommentList
          postId={post.id}
          currentUserId={currentUserId}
        />
      </div>
    </Layout>
  );
};

export default PostDetailPage; 