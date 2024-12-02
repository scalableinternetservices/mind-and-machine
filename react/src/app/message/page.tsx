'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ChatRoom, User } from '@/types';
import { chatService } from '@/services/chat';
import { postService } from '@/services/post';
import Link from 'next/link';
import { UserCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import NewChatModal from '@/components/chat/NewChatModal';
import { AxiosError } from 'axios';

const MessagePage = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const rooms = await chatService.getChatRooms();
      setChatRooms(rooms);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError('Failed to fetch chat rooms');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChat = async (selectedUsers: User[], name: string) => {
    try {
      const memberIds = selectedUsers.map(user => user.id);
      const newRoom = await chatService.createChatRoom({
        member_ids: memberIds,
        name: name
      });
      setChatRooms([newRoom, ...chatRooms]);
      setIsNewChatModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError('Failed to create chat room');
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
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-bold">Messages</h1>
          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatRooms.map(room => (
            <Link
              key={room.id}
              href={`/message/${room.id}`}
              className="flex items-center space-x-3 p-4 hover:bg-gray-900/50 transition border-b border-gray-800"
            >
              <div className="relative w-12 h-12">
                {room.members.length > 1 ? (
                  <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                    <span className="text-xs text-gray-400 ml-1">
                      {room.members.length}
                    </span>
                  </div>
                ) : (
                  <UserCircleIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold">
                  {room.name}
                </div>
                <div className="text-gray-500 text-sm flex justify-between">
                  {room.members.map((m: User) => m.username).join(', ')}
                </div>
                {room.lastMessage && (
                  <div className="text-gray-500 text-sm flex justify-between">
                    <span>{room.lastMessage.content}</span>
                    <span>
                      {formatDistanceToNow(new Date(room.lastMessage.created_at), {
                        locale: enUS,
                        addSuffix: true
                      })}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateChat}
      />
    </Layout>
  );
};

export default MessagePage; 