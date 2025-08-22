"use client";

import { useState } from "react";

export default function HomeFeed() {
  const [activeCategory, setActiveCategory] = useState("All Items");

  const categories = [
    "All Items",
    "Fashion & Apparel",
    "Electronics",
    "Food & Beverages",
    "DIY & Hardware",
    "Health & Beauty",
  ];

  // Mock data with category field
  const products = [
    {
      id: 1,
      title: "Wireless Headphones",
      price: "₱2500.00",
      category: "Electronics",
      user: "TechGuy",
      location: "Zone 5, Barangay Bulihan",
      date: "8/22/2025",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
    {
      id: 2,
      title: "Casual T-Shirt",
      price: "₱500.00",
      category: "Fashion & Apparel",
      user: "StyleQueen",
      location: "Zone 3, Barangay Uno",
      date: "8/21/2025",
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    },
    {
      id: 3,
      title: "Organic Green Tea",
      price: "₱150.00",
      category: "Food & Beverages",
      user: "HealthyLife",
      location: "Zone 7, Barangay Dos",
      date: "8/20/2025",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    },
  ];

  const filteredProducts =
    activeCategory === "All Items"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "5px" }}>
        Home Feed
      </h2>
      <p style={{ color: "#555", fontSize: "14px", marginBottom: "20px" }}>
        See what's new in your community
      </p>

      {/* Category Filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredProducts.map((product) => (
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
                src={product.image}
                alt={product.title}
                style={{ width: "100%", height: "160px", objectFit: "cover" }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "600",
                  padding: "4px 8px",
                  borderRadius: "8px",
                }}
              >
                For Sale
              </span>
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
                  color: "#ef4444",
                  fontWeight: "700",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                {product.price}
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
                  {product.user.charAt(0)}
                </div>
                <span>{product.user}</span> • <span>{product.location}</span> •{" "}
                <span>{product.date}</span>
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
              <span>2</span>
              <span>0</span>
              <span style={{ color: "#1d4ed8", fontWeight: "600" }}>Buy</span>
            </div>
          </div>
        ))}
      </div>

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
      >
        +
      </button>
    </div>
  );
}
