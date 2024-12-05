'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import Link from 'next/link';
import { AuthError, USERNAME_REGEX, USERNAME_RULES } from '@/types/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password_confirmation: ''
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
      await authService.register(formData);
      router.push('/login');
    } catch (err: any) {
      setErrors(err.response?.data?.errors || {
        general: ['Registration failed. Please try again.']
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-500">Tweet</h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>

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
          <div>
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              value={formData.password_confirmation}
              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white rounded-lg p-3 hover:bg-blue-600 transition disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
} 