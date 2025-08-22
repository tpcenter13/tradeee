
import Navbar from '@/components/navbar';
import '../styles/globals.css'; // kung nasa src/styles
import { AppProvider } from './context/AppContext';


export const metadata = {
  title: 'TradeConnect - Trade, Buy and Sell',
  description: 'A platform for trading, buying and selling goods',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Navbar/>
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}