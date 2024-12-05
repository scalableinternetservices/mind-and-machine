export interface User {
  id: number;
  username: string;
  created_at: string;
  is_guest?: boolean;
}

export interface Post {
  id: number;
  content: string;
  user: User;
  created_at: string;
  updated_at: string;
  comments: Comment[];
  likes: number[];
}

export interface Comment {
  id: number;
  content: string;
  user: User;
  postId: number;
  created_at: string;
  updated_at: string;
} 
