import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import styles from './layout.module.css';
import { generateMetadata } from '@/components/shared/utils/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import React from "react";
import { Theme } from "@radix-ui/themes";
import "./../globals.css"

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
        <Theme>
      <div className="min-h-screen bg-gray-100 admin-page-root">
        <AdminSidebar />
        <main className="container mx-auto py-6">
          {children}
        </main>
      </div>
            </Theme>
    </ProtectedRoute>
  );
}