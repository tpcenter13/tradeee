import Navbar from '../components/Navbar';
import '../styles/globals.css'; // kung nasa src/styles


export const metadata = {
  title: 'TradeConnect - Trade, Buy and Sell',
  description: 'A platform for trading, buying and selling goods',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}