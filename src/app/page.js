"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import styles from './page.module.css';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to dashboard
        if (user.email === 'admintradeconnecta@gmail.com') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/user/home');
        }
      } else {
        // User is signed out, redirect to login
        router.push('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.logoContainer}>
          <Image 
            src="/logo.png" 
            alt="TradeConnect Logo" 
            width={150} 
            height={150} 
            className={styles.logo}
            priority
          />
        </div>
        <h1 className={styles.title}>Welcome to TradeConnect</h1>
        <p className={styles.subtitle}>A Convenience-Driven Way to Trade, Buy, and Sell — Because Even the Little Things Make a Difference.</p>
      </div>
    </div>
  );
}