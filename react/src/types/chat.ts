import { User } from ".";

export interface ChatMessage {
  id: number;
  content: string;
  user: User;
  chatId: number;
  created_at: string;
}

export interface ChatRoom {
  id: number;
  name: string;
  members: User[];
  lastMessage?: ChatMessage;
  created_at: string;
} 