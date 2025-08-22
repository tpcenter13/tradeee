import Header from './Header';
import TradeConnectSidebar from './TradeConnectSidebar';

export default function UserLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', width: '100%'}}>
      {/* Sidebar - Fixed width, full height */}
      <TradeConnectSidebar />
      
      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top Navigation Bar */}
        <header style={{ backgroundColor: '#1e40af', color: '#ffffff', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>TradeConnect</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ color: 'rgba(147, 197, 253, 0.7)', transition: 'color 0.2s ease', ':hover': { color: '#ffffff' } }}>
              Logout
            </button>
          </div>
        </header>

         {/* Search */}
        <div style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Header />    
        </div>

        {/* Main Content - Scrollable */}
        <main style={{ flex: 1, backgroundColor: '#f9fafb', overflowY: 'auto', padding: '1rem' }}>
          {children}
        </main>

      </div>
    </div>
  );
}