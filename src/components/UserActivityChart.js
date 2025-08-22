"use client";
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './UserActivityChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function UserActivityChart({ users }) {
  // Process user data to get activity by zone
  const getActivityByZone = () => {
    const zoneCounts = {};
    const activeUsers = users.filter(user => 
      new Date(user.lastActive) > new Date(Date.now() - 86400000) // Active in last 24 hours
    );

    // Initialize all zones
    for (let i = 1; i <= 11; i++) {
      zoneCounts[`Zone ${i}`] = 0;
    }

    // Count active users per zone
    activeUsers.forEach(user => {
      const zone = `Zone ${user.zone}`;
      if (zoneCounts.hasOwnProperty(zone)) {
        zoneCounts[zone]++;
      }
    });

    return zoneCounts;
  };

  const zoneActivity = getActivityByZone();
  const zones = Object.keys(zoneActivity);
  const activeCounts = Object.values(zoneActivity);

  // Calculate total users per zone for percentage
  const getTotalUsersByZone = () => {
    const totalCounts = {};
    
    // Initialize all zones
    for (let i = 1; i <= 11; i++) {
      totalCounts[`Zone ${i}`] = 0;
    }

    // Count all users per zone
    users.forEach(user => {
      const zone = `Zone ${user.zone}`;
      if (totalCounts.hasOwnProperty(zone)) {
        totalCounts[zone]++;
      }
    });

    return totalCounts;
  };

  const totalUsersByZone = getTotalUsersByZone();
  const percentages = zones.map((zone, index) => {
    const total = totalUsersByZone[zone];
    return total > 0 ? Math.round((activeCounts[index] / total) * 100) : 0;
  });

  const data = {
    labels: zones,
    datasets: [
      {
        label: 'Active Users (24h)',
        data: activeCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Activity Percentage',
        data: percentages,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Activity by Zone',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.datasetIndex === 0) {
              label += `${context.raw} users`;
            } else {
              label += `${context.raw}% of zone users`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Active Users',
        },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        title: {
          display: true,
          text: 'Percentage of Active Users',
        },
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Bar data={data} options={options} />
      <div className={styles.chartFooter}>
        <p>Total Active Users: {activeCounts.reduce((a, b) => a + b, 0)}</p>
        <p>Last Updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}