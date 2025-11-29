import { LucideIcon } from 'lucide-react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
}

export default function StatCard({ title, value, icon: Icon, change, changeType }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Icon size={24} />
        </div>
      </div>
      <div className={styles.content}>
        <h3>{title}</h3>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
}