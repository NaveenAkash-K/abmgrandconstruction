"use client";

import { Eye, FileText, Users, Briefcase } from 'lucide-react';
import StatCard from '@/components/admin/dashboard/StatCard'
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import styles from './page.module.css';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Projects',
      value: '156',
      icon: Briefcase,
      change: '+12%',
      changeType: 'increase' as const
    },
    {
      title: 'Active Services',
      value: '6',
      icon: FileText,
      change: '0%',
      changeType: 'neutral' as const
    },
    {
      title: 'Total Clients',
      value: '48',
      icon: Users,
      change: '+8%',
      changeType: 'increase' as const
    },
    {
      title: 'Page Views (30d)',
      value: '12.5K',
      icon: Eye,
      change: '+24%',
      changeType: 'increase' as const
    }
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome back to ABM Grand Construction Admin</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.sideContent}>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}