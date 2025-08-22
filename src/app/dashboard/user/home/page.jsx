"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/app/context/AppContext"; // Adjust path to match your context

export default function HomeFeed() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppState(); // Get current user from context
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    "All Items",
    "Fashion & Apparel",
    "Electronics",
    "Food & Beverages",
    "DIY & Hardware",
    "Health & Beauty",
  ];

  const fetchProducts = async (category = null) => {
    try {
      setLoading(true);
      const url =
        category && category !== "All Items"
          ? `/api/posts?category=${encodeURIComponent(category)}`
          : "/api/posts";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory]);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  const formatPrice = (product) => {
    if (product.isSelling && product.price) {
      return `₱${parseFloat(product.price).toFixed(2)}`;
    }
    return "For Trade";
  };

  const getDisplayLocation = (seller) => {
    return seller?.email || "Unknown Location";
  };

  const getSellerInitial = (seller) => {
    if (seller?.email) {
      return seller.email.charAt(0).toUpperCase();
    }
    if (seller?.uid) {
      return seller.uid.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Check if current user is the seller of the product
  const isCurrentUserSeller = (product) => {
    if (!user || !isAuthenticated) return false;
    
    // Check by UID if available
    if (product.seller?.uid && user.uid) {
      return product.seller.uid === user.uid;
    }
    
    // Fallback to email comparison
    if (product.seller?.email && user.email) {
      return product.seller.email === user.email;
    }
    
    return false;
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleBuyTradeClick = (product) => {
    // Don't allow users to buy/trade their own products
    if (isCurrentUserSeller(product)) {
      return;
    }

    // Create a message with product details
    const message = `Hi, I'm interested in your ${product.title} (${product.isSelling ? 'For Sale' : 'For Trade'})`;
    
    // Get seller email
    const sellerEmail = product.seller?.email || "Unknown Seller";
    
    // Navigate to messages page with product info as query params
    router.push(`/dashboard/user/messages?product=${encodeURIComponent(product.title)}&message=${encodeURIComponent(message)}&sellerEmail=${encodeURIComponent(sellerEmail)}&productId=${product.id}&price=${product.price}&image=${product.images[0]}&isSelling=${product.isSelling}`);
  };

  const renderActionButton = (product) => {
    if (isCurrentUserSeller(product)) {
      return (
        <span className="text-gray-500 font-semibold">
          Your Product
        </span>
      );
    }

    return (
      <span 
        className="text-blue-700 font-semibold cursor-pointer hover:text-blue-800"
        onClick={() => handleBuyTradeClick(product)}
      >
        {product.isSelling ? "Buy" : "Trade"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-5 font-sans">
        <h2 className="text-[22px] font-bold mb-1">Home Feed</h2>
        <p className="text-gray-600 text-sm mb-5">Loading products...</p>
        <div className="flex justify-center py-10">
          <div className="text-lg text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 font-sans">
        <h2 className="text-[22px] font-bold mb-1">Home Feed</h2>
        <p className="text-gray-600 text-sm mb-5">
          See what's new in your community
        </p>
        <div className="bg-red-100 text-red-600 p-4 rounded-lg text-center">
          {error}
          <button
            onClick={() => fetchProducts(activeCategory)}
            className="block mx-auto mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 font-sans">
      {/* Header */}
      <h2 className="text-[22px] font-bold mb-1">Home Feed</h2>
      <p className="text-gray-600 text-sm mb-5">
        See what's new in your community ({products.length} items)
      </p>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full font-medium ${
              activeCategory === cat
                ? "bg-blue-700 text-white shadow-md"
                : "bg-gray-200 text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <div className="text-center p-10 text-gray-600 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="mb-2 text-lg font-semibold">No items found</h3>
          <p>
            {activeCategory === "All Items"
              ? "Be the first to post an item in your community!"
              : `No items found in ${activeCategory} category.`}
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md w-[280px] overflow-hidden"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=160&fit=crop";
                  }}
                />
                <span
                  className={`absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded ${
                    product.isSelling ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {product.isSelling ? "For Sale" : "For Trade"}
                </span>
                {product.quantity > 1 && (
                  <span className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded">
                    Qty: {product.quantity}
                  </span>
                )}
                {/* Add "Your Product" badge for current user's items */}
                {isCurrentUserSeller(product) && (
                  <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    Your Product
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="text-sm font-semibold mb-1 text-gray-900">
                  {product.title}
                </h3>
                <p
                  className={`font-bold text-sm mb-1 ${
                    product.isSelling ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {formatPrice(product)}
                </p>
                {!product.isSelling && product.tradeFor && (
                  <p className="text-gray-500 text-xs mb-2 italic">
                    Looking for: {product.tradeFor}
                  </p>
                )}
                <p className="text-gray-500 text-xs mb-2 leading-snug">
                  {product.description.length > 60
                    ? `${product.description.substring(0, 60)}...`
                    : product.description}
                </p>

                {/* User & Location */}
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                  <div className="w-[22px] h-[22px] bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {getSellerInitial(product.seller)}
                  </div>
                  <span>{getDisplayLocation(product.seller)}</span> •
                  <span>{formatDate(product.createdAt)}</span>
                </div>
                  <span className="text-xs text-gray-600">Location: {product.zone}</span>
              </div>
             
              {/* Footer */}
              <div className="flex justify-between border-t border-gray-200 px-3 py-2 text-xs text-gray-700">
                <span>❤️ 0</span>
                <span>💬 0</span>
                {renderActionButton(product)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        className="fixed bottom-5 right-5 w-[50px] h-[50px] bg-blue-600 text-white rounded-full text-2xl shadow-lg flex items-center justify-center"
        onClick={() => console.log("Add new post")}
      >
        +
      </button>
    </div>
  );
}