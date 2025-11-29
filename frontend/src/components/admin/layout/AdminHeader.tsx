"use client";

import { Bell, User } from 'lucide-react';
import styles from './AdminHeader.module.css';

export default function AdminHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.welcome}>
          <span>Welcome, Admin</span>
        </div>
        <div className={styles.actions}>
          <button className={styles.iconButton}>
            <Bell size={20} />
          </button>
          <button className={styles.profileButton}>
            <User size={20} />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}