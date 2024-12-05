'use client';

import { Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useState } from 'react';
import { postService } from '@/services/post';
import { TrashIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { PencilIcon } from '@heroicons/react/24/outline';
import { AxiosError } from 'axios';

interface CommentListProps {
  comments: Comment[];
  postId: number;
  onCommentAdded?: (newComment: Comment) => void;
  onCommentDeleted?: (commentId: number) => void;
  onCommentUpdated?: (updatedComment: Comment) => void;
  currentUserId?: number | null;
}

const CommentList = ({
  comments,
  postId,
  onCommentAdded,
  onCommentDeleted,
  onCommentUpdated,
  currentUserId,
}: CommentListProps) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const isGuestPost = localStorage.getItem('username') === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const comment = await postService.createComment(postId, newComment);
      onCommentAdded?.(comment);
      setNewComment('');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          setError('Please login to comment');
      } else {
          setError('Failed to add comment');
        }
      }
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await postService.deleteComment(postId, commentId);
      onCommentDeleted?.(commentId);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          setError('Please login to delete comment');
      } else {
        setError('Failed to delete comment');
      }
      }
      console.error('Error deleting comment:', err);
    }
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const updatedComment = await postService.updateComment(postId, commentId, editContent);
      onCommentUpdated?.(updatedComment);
      setEditingCommentId(null);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          setError('Please login to update comment');
        } else {
          setError('Failed to update comment');
        }
      }
      console.error('Error updating comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className="p-4 border-b border-gray-800">
        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full bg-transparent border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition disabled:opacity-50"
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </form>
      <div className="flex flex-col divide-y divide-gray-800">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4">
            <div className="flex space-x-3">
              <UserCircleIcon className="w-10 h-10 text-gray-400" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">@{comment.user.username}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        locale: enUS,
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  { !isGuestPost && currentUserId === comment.user.id && (
                    <div className="flex items-center space-x-2">
                      {editingCommentId !== comment.id && (
                        <>
                          <button
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditContent(comment.content);
                            }}
                            className="text-gray-500 hover:text-blue-500"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {editingCommentId === comment.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-transparent border border-gray-800 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="px-3 py-1 text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={isSubmitting}
                        className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2">{comment.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList; 