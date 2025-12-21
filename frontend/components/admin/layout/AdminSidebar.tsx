"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  Users,
  Award,
  Info,
  Phone,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import styles from './AdminSidebar.module.css';
import logo from "@/assets/logo.png";
import Image from "next/image";
import { authService } from '@/services/authService';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Briefcase, label: 'Projects', href: '/admin/projects' },
  { icon: Wrench, label: 'Services', href: '/admin/services' },
  // { icon: Users, label: 'Clients', href: '/admin/clients' },
  { icon: Award, label: 'Why Choose Us', href: '/admin/why-choose-us' },
  { icon: Info, label: 'About', href: '/admin/about' },
  { icon: Phone, label: 'Contact', href: '/admin/contact' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // authService.logout();
        localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X /> : <Menu />}
      </button>

      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.logo}>
            <Image src={logo} alt={""} className={styles.logoIcon}/>
          <h2>ABM Admin</h2>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button className={styles.logoutButton}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className={styles.alertOverlay} />
              <AlertDialog.Content className={styles.alertContent}>
                <AlertDialog.Title className={styles.alertTitle}>
                  Confirm Logout
                </AlertDialog.Title>
                <AlertDialog.Description className={styles.alertDescription}>
                  Are you sure you want to logout? You will need to login again to access the admin panel.
                </AlertDialog.Description>
                <div className={styles.alertActions}>
                  <AlertDialog.Cancel asChild>
                    <button className={styles.alertCancelButton}>Cancel</button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      className={styles.alertLogoutButton}
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      </aside>
    </>
  );
}