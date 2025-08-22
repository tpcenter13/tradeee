'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function ZoneDistribution({ users, detailed = false }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Count users per zone
    const zoneCounts = {};
    users.forEach(user => {
      const zone = user.zone || 'Unknown';
      zoneCounts[zone] = (zoneCounts[zone] || 0) + 1;
    });

    // Sort zones numerically (1-11) with Unknown last
    const sortedZones = Object.keys(zoneCounts).sort((a, b) => {
      if (a === 'Unknown') return 1;
      if (b === 'Unknown') return -1;
      return parseInt(a) - parseInt(b);
    });

    const labels = sortedZones.map(zone => `Zone ${zone}`);
    const data = sortedZones.map(zone => zoneCounts[zone]);
    
    const backgroundColors = sortedZones.map((zone, index) => {
      if (zone === 'Unknown') return '#95a5a6';
      const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3',
        '#33FFF3', '#FF8C33', '#8C33FF', '#33FF8C', '#FF338C',
        '#33A2FF'
      ];
      return colors[(parseInt(zone) - 1) % colors.length];
    });

    if (detailed) {
      // Detailed pie chart
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: backgroundColors,
            borderColor: '#fff',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    } else {
      // Simple doughnut chart
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: backgroundColors,
            borderColor: '#fff',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          cutout: '70%'
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [users, detailed]);

  return <canvas ref={chartRef} />;
}