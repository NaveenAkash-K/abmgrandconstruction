"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import styles from './AdminSidebar.module.css';
import logo from "@/assets/logo.png";
import Image from "next/image";

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
          <button className={styles.logoutButton}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}