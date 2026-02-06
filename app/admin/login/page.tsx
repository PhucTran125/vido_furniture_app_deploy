'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple password check (in production, use proper auth)
    if (password === 'admin123') {
      // Set auth cookie
      document.cookie = 'admin_auth=true; path=/; max-age=86400'; // 24 hours
      router.push('/admin/products');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl text-primary mb-2">
            VIDO FURNITURE
          </h1>
          <p className="text-gray-600">Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Enter admin password"
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Login
          </button>

          <div className="text-center text-sm text-gray-500">
            Default password: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
          </div>
        </form>
      </div>
    </div>
  );
}
