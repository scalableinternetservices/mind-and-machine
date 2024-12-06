import axios, { AxiosError } from 'axios';
import { Post, Comment, User } from '@/types';

const API_URL = 'http://localhost:3000';

// set interceptor for request
axios.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = 'http://localhost:8000';
  return config;
});

export const postService = {
  async getPosts(): Promise<Post[]> {
    try {
      const response = await axios.get(`${API_URL}/api/posts`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch posts');
      }
      throw error;
    }
  },

  async createPost(content: string): Promise<Post> {
    try {
      const response = await axios.post(`${API_URL}/api/posts`, {
        content: content
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to create post');
      }
      throw error;
    }
  },

  async likePost(postId: number): Promise<Post> {
    try {
      const response = await axios.post(`${API_URL}/api/posts/${postId}/like`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to like post');
      }
      throw error;
    }
  },

  async unlikePost(postId: number): Promise<Post> {
    try {
      const response = await axios.delete(`${API_URL}/api/posts/${postId}/unlike`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to unlike post');
      }
      throw error;
    }
  },

  async getPost(postId: number): Promise<Post> {
    try {
      const response = await axios.get(`${API_URL}/api/posts/${postId}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch post');
      }
      throw error;
    }
  },

  async createComment(postId: number, content: string): Promise<Comment> {
    try {
      const response = await axios.post(`${API_URL}/api/posts/${postId}/comments`, {
        content: content
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to create comment');
      }
      throw error;
    }
  },

  async deleteComment(postId: number, commentId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/posts/${postId}/comments/${commentId}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to delete comment');
      }
      throw error;
    }
  },

  async updatePost(postId: number, content: string): Promise<Post> {
    try {
      const response = await axios.put(`${API_URL}/api/posts/${postId}`, {
        content: content
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update post');
      }
      throw error;
    }
  },

  async updateComment(postId: number, commentId: number, content: string): Promise<Comment> {
    try {
      const response = await axios.put(`${API_URL}/api/posts/${postId}/comments/${commentId}`, {
        content: content
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update comment');
      }
      throw error;
    }
  },

  async deletePost(postId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/posts/${postId}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to delete post');
      }
      throw error;
    }
  },

  async getUserPosts(userId: number): Promise<Post[]> {
    try {
      const response = await axios.get(`${API_URL}/api/user/${userId}/posts`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user posts');
      }
      throw error;
    }
  },

  async getPostComments(postId: number): Promise<Comment[]> {
    try {
      const response = await axios.get(`${API_URL}/api/posts/${postId}/comments`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch post comments');
      }
      throw error;
    }
  },

  async getLikedPosts(userId: number): Promise<Post[]> {
    try {
      const response = await axios.get(`${API_URL}/api/user/${userId}/liked_posts`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch liked posts');
      }
      throw error;
    }
  },

  async searchPosts(query: string): Promise<Post[]> {
    try {
      const response = await axios.get(`${API_URL}/api/search/posts?q=${query}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to search posts');
      }
      throw error;
    }
  },

  async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await axios.get(`${API_URL}/api/search/users?q=${query}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to search users');
      }
      throw error;
    }
  },
}; 