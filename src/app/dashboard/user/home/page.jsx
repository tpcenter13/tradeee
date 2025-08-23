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

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reportType, setReportType] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const categories = [
    "All Items",
    "Fashion & Apparel",
    "Electronics",
    "Food & Beverages",
    "DIY & Hardware",
    "Health & Beauty",
  ];

  const reportTypes = [
    "Scam/Fraud",
    "Inappropriate Content",
    "Fake Product",
    "Misleading Information",
    "Prohibited Item",
    "Spam",
    "Other",
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

  const isCurrentUserSeller = (product) => {
    if (!user || !isAuthenticated) return false;

    if (product.seller?.uid && user.uid) {
      return product.seller.uid === user.uid;
    }

    if (product.seller?.email && user.email) {
      return product.seller.email === user.email;
    }

    return false;
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleBuyTradeClick = (product) => {
    if (isCurrentUserSeller(product)) {
      return;
    }

    const message = `Hi, I'm interested in your ${product.title} (${product.isSelling ? 'For Sale' : 'For Trade'})`;
    const sellerEmail = product.seller?.email || "Unknown Seller";
    router.push(
      `/dashboard/user/messages?product=${encodeURIComponent(product.title)}&message=${encodeURIComponent(
        message
      )}&sellerEmail=${encodeURIComponent(sellerEmail)}&productId=${product.id}&price=${
        product.price
      }&image=${product.images[0]}&isSelling=${product.isSelling}`
    );
  };

  const handleReportClick = (product) => {
    if (!isAuthenticated || !user) {
      alert("Please log in to report a product.");
      return;
    }
    setSelectedProduct(product);
    setShowReportModal(true);
    setReportType("");
    setReportDescription("");
  };

  const handleReportSubmit = async () => {
    if (!reportType || !reportDescription.trim()) {
      alert("Please select a report type and provide a description.");
      return;
    }

    if (reportDescription.length < 10 || reportDescription.length > 500) {
      alert("Description must be between 10 and 500 characters.");
      return;
    }

    setReportLoading(true);

    try {
      const response = await fetch("/api/postReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          reportType,
          description: reportDescription,
          reportedBy: user?.uid || user?.email,
          productTitle: selectedProduct.title,
          sellerEmail: selectedProduct.seller?.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Report submitted successfully. We'll review it shortly.");
        setShowReportModal(false);
      } else {
        if (response.status === 400) {
          alert(data.error || "Invalid report data. Please check your inputs.");
        } else if (response.status === 409) {
          alert(data.error || "You have already reported this product.");
        } else {
          alert(data.message || "Failed to submit report. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report due to a network error. Please try again.");
    } finally {
      setReportLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowReportModal(false);
    setSelectedProduct(null);
    setReportType("");
    setReportDescription("");
  };

  const renderActionButton = (product) => {
    if (isCurrentUserSeller(product)) {
      return <span className="text-gray-500 font-semibold">Your Product</span>;
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
        <p className="text-gray-600 text-sm mb-5">See what's new in your community</p>
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
      <h2 className="text-[22px] font-bold mb-1">Home Feed</h2>
      <p className="text-gray-600 text-sm mb-5">
        See what's new in your community ({products.length} items)
      </p>

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
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-40 object-cover"
                  loading="lazy"
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
                {isCurrentUserSeller(product) && (
                  <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    Your Product
                  </span>
                )}
              </div>

              <div className="p-3">
                <h3 className="text-sm font-semibold mb-1 text-gray-900">{product.title}</h3>
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

                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                  <div className="w-[22px] h-[22px] bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {getSellerInitial(product.seller)}
                  </div>
                  <span>{getDisplayLocation(product.seller)}</span> •
                  <span>{formatDate(product.createdAt)}</span>
                </div>
                <span className="text-xs text-gray-600">Location: {product.zone}</span>
              </div>

              <div className="flex justify-between border-t border-gray-200 px-3 py-2 text-xs text-gray-700">
                <span>❤️ 0</span>
                <button
                  onClick={() => handleReportClick(product)}
                  className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                  disabled={isCurrentUserSeller(product)}
                >
                  {isCurrentUserSeller(product) ? "🚫" : "🚨 Report"}
                </button>
                {renderActionButton(product)}
              </div>
            </div>
          ))}
        </div>
      )}

      {showReportModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-labelledby="report-modal-title"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 id="report-modal-title" className="text-lg font-bold text-gray-900">
                  Report Product
                </h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                  aria-label="Close report modal"
                >
                  ×
                </button>
              </div>

              {selectedProduct && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Reporting:</p>
                  <p className="font-semibold text-sm">{selectedProduct.title}</p>
                  <p className="text-xs text-gray-500">
                    by {getDisplayLocation(selectedProduct.seller)}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a reason</option>
                  {reportTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Please provide details about why you're reporting this product..."
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  required
                />
                <p
                  className={`text-xs mt-1 ${
                    reportDescription.length > 450 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {reportDescription.length}/500 characters
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleModalClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 font-medium"
                  disabled={reportLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportSubmit}
                  disabled={reportLoading || !reportType || !reportDescription.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {reportLoading ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        className="fixed bottom-5 right-5 w-[50px] h-[50px] bg-blue-600 text-white rounded-full text-2xl shadow-lg flex items-center justify-center"
        onClick={() => console.log("Add new post")}
      >
        +
      </button>
    </div>
  );
}