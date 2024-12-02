'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { User } from '@/types';
import { postService } from '@/services/post';
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (selectedUsers: User[], name: string) => void;
}

const NewChatModal = ({ isOpen, onClose, onCreateChat }: NewChatModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [chatName, setChatName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      searchUsers();
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    setIsLoading(true);
    try {
      const results = await postService.searchUsers(searchQuery);
      setUsers(results);
    } catch (err) {
      console.error('Failed to search users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery('');
    setUsers([]);
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const handleSubmit = () => {
    if (selectedUsers.length > 0) {
      onCreateChat(selectedUsers, chatName.trim() || generateDefaultName(selectedUsers));
    }
  };

  const generateDefaultName = (users: User[]) => {
    const currentUsername = localStorage.getItem('username');
    if (users.find(u => u.username === currentUsername)) {
      return users.map(u => u.username).join(', ');
    }
    return users.map(u => u.username).join(', ') + ', ' + currentUsername;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white mb-4">
                  New Message
                </Dialog.Title>

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={chatName}
                      onChange={(e) => setChatName(e.target.value)}
                      placeholder="Enter chat name"
                      className="w-full bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 min-h-[32px]">
                    {selectedUsers.map(user => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full"
                      >
                        <span>{user.username}</span>
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="hover:text-blue-300"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search people"
                    className="w-full bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {searchQuery && (
                    <div className="max-h-60 overflow-y-auto">
                      {users.map(user => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className="flex items-center space-x-3 w-full p-3 hover:bg-gray-800 rounded-lg transition"
                        >
                          <UserCircleIcon className="w-10 h-10 text-gray-400" />
                          <span className="text-white">{user.username}</span>
                        </button>
                      ))}
                      {isLoading && (
                        <div className="text-center text-gray-500 py-2">
                          Searching...
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={selectedUsers.length === 0}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NewChatModal; 