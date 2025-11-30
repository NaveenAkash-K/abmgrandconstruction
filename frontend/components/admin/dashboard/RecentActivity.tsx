import { Clock } from 'lucide-react';
import styles from './RecentActivity.module.css';

const activities = [
  {
    id: 1,
    action: 'New project added',
    description: 'Tech Campus Development project was created',
    time: '2 hours ago',
    type: 'project'
  },
  {
    id: 2,
    action: 'Client added',
    description: 'COMPANY XYZ added to clients list',
    time: '5 hours ago',
    type: 'client'
  },
  {
    id: 3,
    action: 'Service updated',
    description: 'Residential Construction service details modified',
    time: '1 day ago',
    type: 'service'
  },
  {
    id: 4,
    action: 'Project status changed',
    description: 'Corporate Office Tower marked as completed',
    time: '2 days ago',
    type: 'project'
  }
];

export default function RecentActivity() {
  return (
    <div className={styles.container}>
      <h2>Recent Activity</h2>
      <div className={styles.activities}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.activity}>
            <div className={styles.dot} data-type={activity.type} />
            <div className={styles.content}>
              <h4>{activity.action}</h4>
              <p>{activity.description}</p>
              <span className={styles.time}>
                <Clock size={14} />
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}