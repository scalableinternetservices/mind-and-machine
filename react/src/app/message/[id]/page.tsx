'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { ChatMessage, ChatRoom } from '@/types/chat';
import { chatService } from '@/services/chat';
import { UserCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Link from 'next/link';
import { AxiosError } from 'axios';

const ChatRoomPage = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = parseInt(localStorage.getItem('userId') || '0');

  useEffect(() => {
    if (id) {
      const chatId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
      fetchMessages(chatId);
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (chatId: number) => {
    try {
      const msgs = await chatService.getChatMessages(chatId);
      const sortedMsgs = msgs.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setMessages(sortedMsgs);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError('Failed to fetch messages');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !id) return;

    try {
      const chatId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
      const message = await chatService.sendMessage(chatId, newMessage);
      setMessages(prevMessages => [...prevMessages, message]);
      setNewMessage('');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError('Failed to send message');
      }
    }
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
      <div className="flex flex-col h-screen">
        <div className="p-4 border-b border-gray-800 flex items-center space-x-4">
          <Link href="/message" className="text-gray-400 hover:text-white">
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <div className="flex items-center space-x-3">
            <UserCircleIcon className="w-10 h-10 text-gray-400" />
            <div>
              <div className="font-bold">
                {chatRoom?.name || chatRoom?.members.map(m => m.username).join(', ')}
              </div>
              <div className="text-sm text-gray-500">
                {chatRoom?.members.length} members
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages
            .map((message, index) => {
              const isCurrentUser = message.user.id === currentUserId;
              const showUsername = !isCurrentUser && (
                index === 0 || 
                messages[index - 1].user.id !== message.user.id
              );

              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-[70%] ${
                      isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                    } items-end space-x-2`}
                  >
                    {!isCurrentUser && (
                      <UserCircleIcon className="w-8 h-8 text-gray-400" />
                    )}
                    <div className="flex flex-col">
                      {showUsername && (
                        <span className="text-sm text-gray-500 mb-1 ml-1">
                          {message.user.username}
                        </span>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isCurrentUser
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-gray-800 text-white rounded-bl-none'
                        }`}
                      >
                        <p>{message.content}</p>
                        <div className="text-xs opacity-70 mt-1">
                          {formatDistanceToNow(new Date(message.created_at), {
                            locale: enUS,
                            addSuffix: true
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatRoomPage; 