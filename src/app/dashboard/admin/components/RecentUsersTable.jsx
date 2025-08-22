'use client';

import { FaUser, FaCheckCircle, FaTimesCircle, FaEllipsisV } from 'react-icons/fa';
import styles from './RecentUsersTable.module.css';

// Sample data - replace with actual data from your API
const recentUsers = [
  {
    id: 1,
    name: 'Katkai',
    email: 'maricarcaratao11@gmail.com',
    status: 'active',
    lastActive: '2 hours ago',
  },
  {
    id: 2,
    name: 'Car',
    email: '11327caratao@gmail.com',
    status: 'offline',
    lastActive: '1 day ago',
  },
  {
    id: 3,
    name: 'John Doe',
    email: 'johndoe@example.com',
    status: 'active',
    lastActive: '30 minutes ago',
  },
  {
    id: 4,
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    status: 'inactive',
    lastActive: '3 days ago',
  },
  {
    id: 5,
    name: 'Mike Johnson',
    email: 'mikej@example.com',
    status: 'active',
    lastActive: '1 hour ago',
  },
];

const RecentUsersTable = () => {
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <FaCheckCircle className={styles.statusActive} />;
      case 'offline':
        return <FaTimesCircle className={styles.statusOffline} />;
      default:
        return <FaTimesCircle className={styles.statusInactive} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Users</h3>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Email</th>
              <th className={`${styles.th} ${styles.statusHeader}`}>Status</th>
              <th className={styles.th}>Last Active</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((user) => (
              <tr key={user.id} className={styles.tr}>
                <td className={`${styles.td} ${styles.userCell}`}>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      <FaUser className={styles.avatarIcon} />
                    </div>
                    <span className={styles.userName}>{user.name}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <span className={styles.email}>{user.email}</span>
                </td>
                <td className={`${styles.td} ${styles.statusCell}`}>
                  <div className={`${styles.status} ${styles[`status-${user.status.toLowerCase()}`]}`}>
                    {getStatusIcon(user.status)}
                    <span>{user.status}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <span className={styles.lastActive}>{user.lastActive}</span>
                </td>
                <td className={`${styles.td} ${styles.actionsCell}`}>
                  <button className={styles.menuButton}>
                    <FaEllipsisV className={styles.menuIcon} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className={styles.footer}>
        <button className={styles.viewAllButton}>
          View All Users
        </button>
      </div>
    </div>
  );
};

export default RecentUsersTable;
