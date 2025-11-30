import Link from 'next/link';
import { Plus, FileText, Users, Award } from 'lucide-react';
import styles from './QuickActions.module.css';

const actions = [
  {
    icon: Plus,
    label: 'Add Project',
    href: '/admin/projects/new',
    color: 'blue'
  },
  {
    icon: FileText,
    label: 'Manage Services',
    href: '/admin/services',
    color: 'green'
  },
  {
    icon: Users,
    label: 'View Clients',
    href: '/admin/clients',
    color: 'purple'
  },
  {
    icon: Award,
    label: 'Update About',
    href: '/admin/about',
    color: 'orange'
  }
];

export default function QuickActions() {
  return (
    <div className={styles.container}>
      <h2>Quick Actions</h2>
      <div className={styles.grid}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              href={action.href}
              className={`${styles.actionCard} ${styles[action.color]}`}
            >
              <Icon size={24} />
              <span>{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}