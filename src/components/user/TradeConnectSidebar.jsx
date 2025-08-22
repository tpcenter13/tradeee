'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  User, 
  MessageCircle, 
  Store, 
  Users, 
  HelpCircle,
  Package
} from 'lucide-react';

export default function TradeConnectSidebar() {
  const pathname = usePathname();
  
  const menuItems = [
    { name: 'Home', icon: Home, href: '/dashboard/user/home', hasNotification: false },
    { name: 'Profile', icon: User, href: '/dashboard/user/profile', hasNotification: false },
    { name: 'Messages', icon: MessageCircle, href: '/dashboard/user/messages', hasNotification: true },
    { name: 'Marketplace', icon: Store, href: '/dashboard/user/marketplace', hasNotification: false },
    { name: 'Community Forum', icon: Users, href: '/dashboard/user/communityForum', hasNotification: false },
    { name: 'Help Center', icon: HelpCircle, href: '/dashboard/user/helpCenter', hasNotification: false },
  ];

  const sidebarStyle = {
    width: '16rem',
    background: 'linear-gradient(180deg, #112d4e 0%, #3f72af 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle = {
    padding: '1.5rem',
    marginTop: '60px',
    borderBottom: '1px solid linear-gradient(180deg, #112d4e 0%, #3f72af 100%)',
    flexShrink: 0,
  };

  const navStyle = {
    padding: '1.5rem 0',
  };

  const ulStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  };

  const liStyle = (isActive) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.5rem',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? '#0d2d4fff' : 'transparent',
    borderRight: isActive ? '4px solid #f87171' : 'none',
    boxShadow: isActive ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
    color: isActive ? '#ffffff' : 'rgba(147, 197, 253, 0.7)',
  });

  const iconStyle = (isActive) => ({
    width: '1.25rem',
    height: '1.25rem',
    color: isActive ? '#ffffff' : 'rgba(147, 197, 253, 0.7)',
  });

  const spanStyle = (isActive) => ({
    fontSize: '1rem',
    fontWeight: 500,
    color: isActive ? '#ffffff' : 'rgba(147, 197, 253, 0.7)',
  });

  const notificationStyle = {
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: '#ef4444',
    borderRadius: '9999px',
    animation: 'pulse 1.5s infinite',
  };

  const footerStyle = {
    padding: '1.5rem',
    borderTop: '1px solid rgba(59, 130, 246, 0.3)',
    flexShrink: 0,
    textAlign: 'center',
    opacity: 0.7,
    fontSize: '0.75rem',
    color: 'rgba(147, 197, 253, 0.7)',
  };

  return (
    <div style={sidebarStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ width: '3rem', height: '3rem', backgroundColor: '#ffffff', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package style={{ width: '1.5rem', height: '1.5rem', color: '#1e3a8a' }} />
          </div>
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, textAlign: 'center', color: '#ffffff' }}>TradeConnect</h1>
      </div>

      {/* Navigation Menu */}
      <nav style={navStyle}>
        <ul style={ulStyle}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  style={liStyle(isActive)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <IconComponent style={iconStyle(isActive)} />
                    <span style={spanStyle(isActive)}>{item.name}</span>
                  </div>
                  {item.hasNotification && <div style={notificationStyle}></div>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div style={footerStyle}>
        © 2025 TradeConnect
      </div>
    </div>
  );
}