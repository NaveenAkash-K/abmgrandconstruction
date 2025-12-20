import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import styles from './layout.module.css';
import { generateMetadata } from '@/components/shared/utils/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import React from "react";

export const metadata = generateMetadata({
  title: 'Admin Dashboard - ABM GRAND CONSTRUCTION',
  noindex: true,
  nofollow: true,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="container mx-auto py-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}