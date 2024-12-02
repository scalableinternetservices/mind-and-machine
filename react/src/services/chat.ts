import axios, { AxiosError } from 'axios';
import { ChatRoom, ChatMessage } from '@/types';

const API_URL = 'http://localhost:3000';

interface CreateChatRoomParams {
  member_ids: number[];
  name: string;
}

export const chatService = {
  async getChatRooms(): Promise<ChatRoom[]> {
    try {
      const response = await axios.get(`${API_URL}/api/chats`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch chat rooms');
      }
      throw error;
    }
  },

  async createChatRoom(params: CreateChatRoomParams): Promise<ChatRoom> {
    try {
      const response = await axios.post(`${API_URL}/api/chats`, params);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to create chat room');
      }
      throw error;
    }
  },

  async getChatMessages(chatId: number): Promise<ChatMessage[]> {
    try {
      const response = await axios.get(`${API_URL}/api/chats/${chatId}/messages`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch messages');
      }
      throw error;
    }
  },

  async sendMessage(chatId: number, content: string): Promise<ChatMessage> {
    try {
      const response = await axios.post(`${API_URL}/api/chats/${chatId}/messages`, {
        content
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to send message');
      }
      throw error;
    }
  },
}; 