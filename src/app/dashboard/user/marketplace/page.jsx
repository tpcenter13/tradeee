"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/app/context/AppContext"; // Adjust path to match your context
import AddPostButton from "@/components/user/AddPostButton";
import { getAuth } from "firebase/auth"; // Import Firebase Auth for client-side

export default function MarketPlace() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppState();
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false); // Track delete operation
  const [deleteError, setDeleteError] = useState(null); // Track delete-specific errors

  const categories = [
    "All Items",
    "Fashion & Apparel",
    "Electronics",
    "Food & Beverages",
    "DIY & Hardware",
    "Health & Beauty",
  ];

  const fetchUserProducts = async (category = null) => {
    if (!user || !isAuthenticated) {
      setProducts([]);
      setLoading(false);
      return;
    }

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

      // Filter products to show only current user's products
      const userProducts = data.filter((product) => {
        // Check by UID if available
        if (product.seller?.uid && user.uid) {
          return product.seller.uid === user.uid;
        }

        // Fallback to email comparison
        if (product.seller?.email && user.email) {
          return product.seller.email === user.email;
        }

        return false;
      });

      setProducts(userProducts);
      setError(null);
    } catch (error) {
      console.error("Error fetching user products:", error);
      setError("Failed to load your products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProducts(activeCategory);
  }, [activeCategory, user, isAuthenticated]);

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

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError(null);

      // Get the Firebase ID token
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      const idToken = await currentUser.getIdToken();

      const response = await fetch("/api/productDelete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // Include Firebase ID token
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      // Remove product from local state
      setProducts(products.filter((p) => p.id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      setDeleteError(
        error.message || "Failed to delete product. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-5 font-sans">
        <h2 className="text-[22px] font-bold mb-1">My MarketPlace</h2>
        <p className="text-gray-600 text-sm mb-5">Loading your products...</p>
        <div className="flex justify-center py-10">
          <div className="text-lg text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 font-sans">
        <h2 className="text-[22px] font-bold mb-1">My MarketPlace</h2>
        <p className="text-gray-600 text-sm mb-5">Manage your products</p>
        <div className="bg-red-100 text-red-600 p-4 rounded-lg text-center">
          {error}
          <button
            onClick={() => fetchUserProducts(activeCategory)}
            className="block mx-auto mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="p-5 font-sans">
        <h2 className="text-[22px] font-bold mb-1">My MarketPlace</h2>
        <div className="text-center p-10 text-gray-600 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="mb-2 text-lg font-semibold">Please log in</h3>
          <p>You need to be logged in to view your marketplace.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 font-sans">
      {/* Header */}
      <h2 className="text-[22px] font-bold mb-1">My MarketPlace</h2>
      <p className="text-gray-600 text-sm mb-5">
        Manage your products ({products.length} items)
      </p>

      {/* Delete Error */}
      {deleteError && (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg text-center mb-5">
          {deleteError}
        </div>
      )}

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
          <h3 className="mb-2 text-lg font-semibold">No products yet</h3>
          <p>
            {activeCategory === "All Items"
              ? "Start by adding your first product to the marketplace!"
              : `No products found in ${activeCategory} category.`}
          </p>
          <AddPostButton />
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
                {/* Status indicator */}
                <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  Your Product
                </span>
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
              </div>

              {/* Management Footer (Delete only, no Edit) */}
              <div className="flex justify-center border-t border-gray-200 px-3 py-2 text-xs">
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-600 font-semibold cursor-pointer hover:text-red-700"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "🗑️ Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Post Button */}
      <div className="mt-8">
        <AddPostButton />
      </div>
    </div>
  );
}
