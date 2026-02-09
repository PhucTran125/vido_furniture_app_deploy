'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate a slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple password check (in production, use proper auth)
    if (password === 'admin123') {
      // Set auth cookie
      document.cookie = 'admin_auth=true; path=/; max-age=86400'; // 24 hours
      router.push('/admin/products');
    } else {
      setError('Invalid password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md border border-gray-100">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
            <Lock className="text-accent" size={32} />
          </div>
          <h1 className="font-heading font-bold text-4xl text-primary mb-2">
            VIDO FURNITURE
          </h1>
          <p className="text-gray-600 text-lg">Admin Panel</p>
          <div className="w-20 h-1 bg-accent mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className={`w-full px-4 py-3 pl-11 border ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-accent'
                  } rounded-lg focus:ring-2 focus:border-transparent transition-all`}
                placeholder="Enter admin password"
                required
                disabled={loading}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="font-medium">⚠️</span> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Login to Admin Panel
              </>
            )}
          </button>

          {/* Development Note */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Development Mode</p>
            <div className="bg-gray-50 px-3 py-2 rounded-lg inline-block">
              <p className="text-sm text-gray-600">
                Password: <code className="bg-white px-2 py-1 rounded font-mono text-accent font-semibold">admin123</code>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
