import AdminSidebar from '@/src/components/admin/layout/AdminSidebar';
import AdminHeader from '@/src/components/admin/layout/AdminHeader';
import styles from './layout.module.css';
import { generateMetadata } from '@/src/components/shared/utils/SEO';

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
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <AdminHeader />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}