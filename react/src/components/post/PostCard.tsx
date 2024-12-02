'use client';

import { Post } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Link from 'next/link';
import { ChatBubbleLeftIcon, HeartIcon as HeartOutline, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { postService } from '@/services/post';
import { AxiosError } from 'axios';

interface PostCardProps {
  post: Post;
  onUpdate?: (updatedPost: Post) => void;
  onDelete?: (postId: number) => void;
  currentUserId?: number | null;
}

const PostCard = ({ post, onUpdate, onDelete, currentUserId }: PostCardProps) => {
  const [likedUserIds, setLikedUserIds] = useState(post.likes);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [error, setError] = useState('');

  const handleLikeClick = async () => {
    if (isLoading || !currentUserId) return;
    
    setIsLoading(true);
    try {
      if (!likedUserIds.includes(currentUserId)) {
        const data = await postService.likePost(post.id);
        setLikedUserIds(data.likes);
        onUpdate?.({...post, likes: data.likes});
      } else {
        const data = await postService.unlikePost(post.id);
        setLikedUserIds(data.likes);
        onUpdate?.({...post, likes: data.likes});
      }
    } catch (error) {
      console.error('Failed to update like status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!editContent.trim() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      await postService.updatePost(post.id, editContent);
      onUpdate?.({...post, content: editContent});
      setIsEditing(false);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {  
        setError('Failed to update post');
      }
      console.error('Error updating post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isLoading) return;
    
    if (confirm('Are you sure you want to delete this post?')) {
      setIsLoading(true);
      try {
        await postService.deletePost(post.id);
        onDelete?.(post.id);
      } catch (err: unknown) {
        setError('Failed to delete post');
        console.error('Error deleting post:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-4 hover:bg-gray-900/50 transition">
      <div className="flex space-x-3">
        <UserCircleIcon className="w-12 h-12 text-gray-400" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href={`/user/${post.user.id}`}>
                <span className="font-bold hover:underline">{post.user.username}</span>
              </Link>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { locale: enUS, addSuffix: true })}
              </span>
            </div>
            {currentUserId && currentUserId === post.user.id && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-gray-500 hover:text-red-500"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-transparent border border-gray-800 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePost}
                  disabled={isLoading}
                  className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <Link href={`/posts/${post.id}`}>
              <p className="mt-2 text-white">{post.content}</p>
            </Link>
          )}

          <div className="flex items-center space-x-8 mt-3 text-gray-500">
            <Link
              href={`/posts/${post.id}`}
              className="flex items-center space-x-2 hover:text-blue-400 group"
            >
              <ChatBubbleLeftIcon className="w-5 h-5 group-hover:bg-blue-400/10 rounded-full p-0.5" />
              <span>{post.comments.length}</span>
            </Link>
            <button
              onClick={handleLikeClick}
              disabled={isLoading || !currentUserId}
              className={`flex items-center space-x-2 group ${
                likedUserIds.includes(currentUserId || 0) ? 'text-pink-600' : 'hover:text-pink-600'
              }`}
            >
              {likedUserIds.includes(currentUserId || 0) ? (
                <HeartSolid className="w-5 h-5 group-hover:bg-pink-600/10 rounded-full p-0.5" />
              ) : (
                <HeartOutline className="w-5 h-5 group-hover:bg-pink-600/10 rounded-full p-0.5" />
              )}
              <span>{likedUserIds.length}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 