'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContactButton } from '@/components/FloatingContactButton';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current path is an admin route
  const isAdminRoute = pathname?.startsWith('/admin');

  // For admin routes, render children without header/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For regular routes, render with header/footer
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingContactButton />
    </>
  );
}
