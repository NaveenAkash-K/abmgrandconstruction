"use client";

import { useEffect, useState } from 'react';
import { Eye, FileText, Users, Briefcase } from 'lucide-react';
import StatCard from '@/components/admin/dashboard/StatCard'
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import styles from './page.module.css';
import { projectService, serviceService} from '@/services';

interface DashboardStats {
  totalProjects: number;
  activeServices: number;
  completedProjects: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeServices: 0,
    completedProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [projectsRes, servicesRes] = await Promise.all([
        projectService.getAll(),
        serviceService.getAll(),
      ]);

      const projects = projectsRes.data || [];
      const services = servicesRes.data || [];

      // Calculate stats
      const completedProjects = projects.filter(
        (p: any) => p.status === 'COMPLETED'
      ).length;

      const activeServices = services.filter(
        (s: any) => s.isActive === true
      ).length;

      setStats({
        totalProjects: projects.length,
        activeServices: activeServices,
        completedProjects: completedProjects,
      });
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
          <p>Loading dashboard data...</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const dashboardStats = [
    {
      title: 'Total Projects',
      value: stats.totalProjects.toString(),
      icon: Briefcase,
      change: `${stats.completedProjects} completed`,
      changeType: 'neutral' as const
    },
    {
      title: 'Active Services',
      value: stats.activeServices.toString(),
      icon: FileText,
      change: 'Currently active',
      changeType: 'neutral' as const
    },
    // {
    //   title: 'Total Clients',
    //   value: stats.totalClients.toString(),
    //   icon: Users,
    //   change: 'Total partners',
    //   changeType: 'neutral' as const
    // },
    {
      title: 'Completed Projects',
      value: stats.completedProjects.toString(),
      icon: Eye,
      change: 'Successfully delivered',
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
        {dashboardStats.map((stat, index) => (
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