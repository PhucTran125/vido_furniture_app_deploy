'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Package, LogOut, Home } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication on mount (except for login page)
  useEffect(() => {
    if (pathname !== '/admin/login') {
      const isAuthenticated = document.cookie.includes('admin_auth=true');
      if (!isAuthenticated) {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    document.cookie = 'admin_auth=; path=/; max-age=0';
    router.push('/admin/login');
  };

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin/products" className="font-heading font-bold text-2xl text-primary">
                VIDO ADMIN
              </Link>
              <nav className="hidden md:flex gap-4">
                <Link
                  href="/admin/products"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${pathname?.startsWith('/admin/products')
                    ? 'bg-accent text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Package size={20} />
                  Products
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home size={20} />
                <span className="hidden sm:inline">View Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
