'use client';

import { Post } from '@/types';
import PostCard from './PostCard';

interface PostListProps {
  posts: Post[];
  currentUserId?: number | null;
  onPostUpdate?: (updatedPost: Post) => void;
  onPostDelete?: (postId: number) => void;
}

const PostList = ({ posts, currentUserId, onPostUpdate, onPostDelete }: PostListProps) => {
  return (
    <div className="flex flex-col divide-y divide-gray-800">
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          currentUserId={currentUserId}
          onUpdate={onPostUpdate}
          onDelete={onPostDelete}
        />
      ))}
    </div>
  );
};

export default PostList; 