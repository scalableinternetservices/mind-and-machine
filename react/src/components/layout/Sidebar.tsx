import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HomeIcon, ChatBubbleLeftIcon, UserIcon, ArrowLeftOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { authService } from '@/services/auth';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const userId = parseInt(localStorage.getItem('userId') || '0');
    const storedUsername = localStorage.getItem('username');
    
    setIsGuest(!username);
    setCurrentUserId(userId);
    setUsername(storedUsername);
  }, []);

  const menuItems = [
    { icon: HomeIcon, label: 'Home', href: '/home' },
    ...(isGuest ? [] : [
      { icon: ChatBubbleLeftIcon, label: 'Message', href: '/message' },
      { icon: UserIcon, label: 'Profile', href: `/user/${currentUserId}` },
    ]),
  ];

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <div className="fixed h-screen w-64 flex flex-col p-4">
      <div className="mb-4">
        <Link href="/home">
          <h1 className="text-3xl font-bold text-blue-500 hover:text-blue-400 transition">
            Tweet
          </h1>
        </Link>
      </div>

      <div className="flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center space-x-4 p-3 hover:bg-gray-900 rounded-full transition"
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xl">{item.label}</span>
          </Link>
        ))}
      </div>
      
      {/* User info and auth section */}
      <div className="border-t border-gray-800 pt-4 mt-2">
        {isGuest ? (
          <div className="space-y-2">
            <Link
              href="/login"
              className="flex items-center space-x-4 p-3 hover:bg-gray-900 rounded-full transition text-blue-500 hover:text-blue-400 w-full"
            >
              <UserIcon className="h-6 w-6" />
              <span className="text-xl">Login</span>
            </Link>
            <Link
              href="/register"
              className="flex items-center space-x-4 p-3 hover:bg-gray-900 rounded-full transition text-green-500 hover:text-green-400 w-full"
            >
              <UserPlusIcon className="h-6 w-6" />
              <span className="text-xl">Register</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="px-3 py-2 text-gray-300">
              <span className="text-l">Signed in as</span>
              <div className="font-bold text-xl">{username}</div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-4 p-3 hover:bg-gray-900 rounded-full transition text-red-500 hover:text-red-600 w-full mt-2"
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
              <span className="text-xl">Logout</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 