'use client';

import { FaTshirt, FaMobileAlt, FaUtensils, FaTools, FaSmile } from 'react-icons/fa';
import styles from './BestSellingCategories.module.css';

const categories = [
  {
    name: 'Fashion & Apparel',
    sales: 1242,
    change: 12.5,
    icon: <FaTshirt className={styles.categoryIcon} />,
    color: '#8b5cf6',
  },
  {
    name: 'Electronics',
    sales: 856,
    change: 8.2,
    icon: <FaMobileAlt className={styles.categoryIcon} />,
    color: '#3b82f6',
  },
  {
    name: 'Food & Beverages',
    sales: 734,
    change: 5.7,
    icon: <FaUtensils className={styles.categoryIcon} />,
    color: '#10b981',
  },
  {
    name: 'DIY & Hardware',
    sales: 512,
    change: 3.9,
    icon: <FaTools className={styles.categoryIcon} />,
    color: '#f59e0b',
  },
  {
    name: 'Health & Beauty',
    sales: 398,
    change: 2.4,
    icon: <FaSmile className={styles.categoryIcon} />,
    color: '#ec4899',
  },
];

const BestSellingCategories = () => {
  
  const maxSales = Math.max(...categories.map(cat => cat.sales));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Best Sell by Category (Weekly)</h3>
      </div>
      
      <div className={styles.categoriesList}>
        {categories.map((category, index) => {
          const barWidth = (category.sales / maxSales) * 100;
          
          return (
            <div key={index} className={styles.categoryItem}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIconContainer} style={{ color: category.color }}>
                  {category.icon}
                </div>
                <span className={styles.categoryName}>{category.name}</span>
                <span className={styles.categorySales}>{category.sales.toLocaleString()}</span>
              </div>
              
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
              
              <div className={styles.categoryFooter}>
                <span 
                  className={`${styles.changeBadge} ${
                    category.change >= 0 ? styles.positive : styles.negative
                  }`}
                >
                  {category.change >= 0 ? '↑' : '↓'} {Math.abs(category.change)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BestSellingCategories;
