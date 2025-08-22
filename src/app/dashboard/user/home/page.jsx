"use client";

import { useState, useEffect } from "react";

export default function HomeFeed() {
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

  // Fetch products from API
  const fetchProducts = async (category = null) => {
    try {
      setLoading(true);
      const url = category && category !== "All Items" 
        ? `/api/posts?category=${encodeURIComponent(category)}`
        : '/api/posts';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount and when category changes
  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory]);

  // Helper function to format date
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  // Helper function to format price
  const formatPrice = (product) => {
    if (product.isSelling && product.price) {
      return `₱${parseFloat(product.price).toFixed(2)}`;
    }
    return "For Trade";
  };

  // Helper function to get display location (using seller info)
  const getDisplayLocation = (seller) => {
    // You might want to add location field to your seller object
    return seller?.email || "Unknown Location";
  };

  // Helper function to get seller initial
  const getSellerInitial = (seller) => {
    if (seller?.email) {
      return seller.email.charAt(0).toUpperCase();
    }
    if (seller?.uid) {
      return seller.uid.charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "5px" }}>
          Home Feed
        </h2>
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "20px" }}>
          Loading products...
        </p>
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <div style={{ fontSize: "18px", color: "#666" }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "5px" }}>
          Home Feed
        </h2>
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "20px" }}>
          See what's new in your community
        </p>
        <div style={{ 
          backgroundColor: "#fee2e2", 
          color: "#dc2626", 
          padding: "16px", 
          borderRadius: "8px",
          textAlign: "center"
        }}>
          {error}
          <button 
            onClick={() => fetchProducts(activeCategory)}
            style={{
              display: "block",
              margin: "10px auto 0",
              padding: "8px 16px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "5px" }}>
        Home Feed
      </h2>
      <p style={{ color: "#555", fontSize: "14px", marginBottom: "20px" }}>
        See what's new in your community ({products.length} items)
      </p>

      {/* Category Filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: activeCategory === cat ? "#1d4ed8" : "#e5e7eb",
              color: activeCategory === cat ? "#fff" : "#111",
              fontWeight: "500",
              cursor: "pointer",
              boxShadow:
                activeCategory === cat ? "0px 2px 6px rgba(0,0,0,0.2)" : "none",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px", 
          color: "#666",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          border: "1px dashed #d1d5db"
        }}>
          <h3 style={{ margin: "0 0 8px 0" }}>No items found</h3>
          <p style={{ margin: 0 }}>
            {activeCategory === "All Items" 
              ? "Be the first to post an item in your community!" 
              : `No items found in ${activeCategory} category.`
            }
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                width: "280px",
                overflow: "hidden",
              }}
            >
              {/* Image */}
              <div style={{ position: "relative" }}>
                <img
                  src={product.images[0]} // Use first image from the array
                  alt={product.title}
                  style={{ width: "100%", height: "160px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=160&fit=crop";
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    backgroundColor: product.isSelling ? "#ef4444" : "#10b981",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "600",
                    padding: "4px 8px",
                    borderRadius: "8px",
                  }}
                >
                  {product.isSelling ? "For Sale" : "For Trade"}
                </span>
                {product.quantity > 1 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "600",
                      padding: "4px 8px",
                      borderRadius: "8px",
                    }}
                  >
                    Qty: {product.quantity}
                  </span>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: "12px" }}>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: "#111",
                  }}
                >
                  {product.title}
                </h3>
                <p
                  style={{
                    color: product.isSelling ? "#ef4444" : "#10b981",
                    fontWeight: "700",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  {formatPrice(product)}
                </p>
                {!product.isSelling && product.tradeFor && (
                  <p
                    style={{
                      color: "#666",
                      fontSize: "12px",
                      marginBottom: "8px",
                      fontStyle: "italic",
                    }}
                  >
                    Looking for: {product.tradeFor}
                  </p>
                )}
                <p
                  style={{
                    color: "#666",
                    fontSize: "12px",
                    marginBottom: "8px",
                    lineHeight: "1.4",
                  }}
                >
                  {product.description.length > 60 
                    ? `${product.description.substring(0, 60)}...` 
                    : product.description
                  }
                </p>

                {/* User & Location */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "#555",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      backgroundColor: "#1d4ed8",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {getSellerInitial(product.seller)}
                  </div>
                  <span>{getDisplayLocation(product.seller)}</span> •
                  <span>{formatDate(product.createdAt)}</span>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #e5e7eb",
                  padding: "8px 12px",
                  fontSize: "12px",
                  color: "#333",
                }}
              >
                <span>❤️ 0</span>
                <span>💬 0</span>
                <span style={{ color: "#1d4ed8", fontWeight: "600", cursor: "pointer" }}>
                  {product.isSelling ? "Buy" : "Trade"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          fontSize: "24px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}
        onClick={() => {
          // You can add navigation to post creation page here
          console.log("Add new post");
        }}
      >
        +
      </button>
    </div>
  );
}