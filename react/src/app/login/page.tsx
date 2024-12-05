'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { AuthError, USERNAME_REGEX, USERNAME_RULES } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<AuthError>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = (username: string): boolean => {
    if (!USERNAME_REGEX.test(username)) {
      setErrors(prev => ({
        ...prev,
        username: [USERNAME_RULES]
      }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateUsername(formData.username)) {
      return;
    }

    setIsLoading(true);

    try {
      await authService.login(formData);
      router.push('/home');
    } catch (err: any) {
      setErrors({
        general: [err.response?.data?.message || 'Login failed. Please try again.']
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-500">Tweet</h1>
          <p className="text-gray-500 mt-2">Connect with the world</p>
        </div>
        
        <button
          onClick={handleGuestAccess}
          className="w-full mb-6 bg-gray-800 text-gray-300 rounded-lg p-3 hover:bg-gray-700 transition flex items-center justify-center space-x-2"
        >
          <span>Continue as Guest</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-500">or login with account</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 mb-4">
            {errors.general[0]}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                setErrors(prev => ({ ...prev, username: undefined }));
              }}
              className={`w-full bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 ${
                errors.username ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white rounded-lg p-3 hover:bg-blue-600 transition disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
} 