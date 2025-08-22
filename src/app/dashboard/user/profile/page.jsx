"use client";

import { useState } from "react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("posts");

  const tabStyle = (tab) => ({
    paddingBottom: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    color: activeTab === tab ? "#1e40af" : "#6b7280",
    borderBottom: activeTab === tab ? "2px solid #1e40af" : "2px solid transparent",
    transition: "color 0.3s ease",
  });

  return (
    <div style={{ maxWidth: "768px", margin: "0 auto", padding: "1rem" }}>
      {/* Profile Header */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "0.75rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#f87171",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 0.5rem",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          U
        </div>
        <h1 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1e40af" }}>User</h1>
        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Zone 5, Barangay Buliha</p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "0.5rem", color: "#6b7280", fontSize: "0.875rem" }}>
          <span>
            <span style={{ color: "#1e40af", fontWeight: "bold" }}>1</span> Posts
          </span>
          <span>
            <span style={{ color: "#1e40af", fontWeight: "bold" }}>1</span> Trades
          </span>
          <span>
            <span style={{ color: "#1e40af", fontWeight: "bold" }}>0.0</span> Rating
          </span>
        </div>

        <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.5rem" }}>
          Member since 2023. Active trader in the community.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          borderBottom: "1px solid #e5e7eb",
          marginTop: "1.5rem",
        }}
      >
        <span style={tabStyle("posts")} onClick={() => setActiveTab("posts")}>
          Posts
        </span>
        <span style={tabStyle("trades")} onClick={() => setActiveTab("trades")}>
          Trades
        </span>
        <span style={tabStyle("reviews")} onClick={() => setActiveTab("reviews")}>
          Reviews
        </span>
      </div>

      {/* Content */}
      <div style={{ marginTop: "1.5rem" }}>
        {activeTab === "posts" && (
          <div>
            <h2 style={{ fontSize: "1.125rem", color: "#1e40af", fontWeight: "600", marginBottom: "1rem" }}>
              My Posts
            </h2>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                maxWidth: "260px",
                margin: "0 auto",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src="https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Wireless Headphones"
                  style={{ width: "100%", height: "160px", objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    left: "0.5rem",
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.25rem",
                    fontWeight: "500",
                  }}
                >
                  For Sale
                </span>
              </div>
              <div style={{ padding: "1rem" }}>
                <h3 style={{ fontSize: "1rem", color: "#1e40af", fontWeight: "500" }}>
                  Wireless Headphones
                </h3>
                <p style={{ fontSize: "1.125rem", color: "#ef4444", fontWeight: "bold", margin: "0.5rem 0" }}>
                  ₱2500.00
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#6b7280", fontSize: "0.75rem" }}>
                  <span>Zone 5, Buliha</span>
                  <span>TechGuy</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                  <span style={{ color: "#3b82f6", fontSize: "0.75rem" }}>08/22/2025</span>
                  <button
                    style={{
                      backgroundColor: "#ef4444",
                      color: "#fff",
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.75rem",
                      border: "none",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "trades" && (
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            <h2 style={{ fontSize: "1.125rem", color: "#1e40af", marginBottom: "1rem" }}>My Trades</h2>
            <p>No trades available yet.</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            <h2 style={{ fontSize: "1.125rem", color: "#1e40af", marginBottom: "1rem" }}>My Reviews</h2>
            <p>No reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
