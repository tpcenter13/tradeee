"use client";

import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();
  
  const handleBuyTradeClick = () => {
    const message = `Hi, I'm interested in your ${product.title} (${product.isSelling ? 'For Sale' : 'For Trade'})`;
    const sellerEmail = product.seller?.email || "Unknown Seller";
    
    router.push(`/dashboard/user/messages?product=${encodeURIComponent(product.title)}&message=${encodeURIComponent(message)}&sellerEmail=${encodeURIComponent(sellerEmail)}&productId=${product.id}&price=${product.price}&image=${product.images[0]}&isSelling=${product.isSelling}`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* ... product card content ... */}
      <button 
        onClick={handleBuyTradeClick}
        className="text-blue-700 font-semibold cursor-pointer"
      >
        {product.isSelling ? "Buy" : "Trade"}
      </button>
    </div>
  );
}