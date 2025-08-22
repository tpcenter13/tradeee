"use client";

import { useState } from "react";
import AddPostModal from "../AddPostModal";

export default function AddPostButton() {
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [isSelling, setIsSelling] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [postImages, setPostImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setPostImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setPostImages((prev) => prev.filter((_, i) => i !== index));
  };

  const showToast = (message) => {
    alert(message);
  };

  const onPostCreated = () => {
    console.log("Post created successfully!");
    setShowAddPostModal(false);
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setShowAddPostModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + Add Product
      </button>

      {/* Modal */}
      {showAddPostModal && (
        <AddPostModal
          isSelling={isSelling}
          setIsSelling={setIsSelling}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          postImages={postImages}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          setShowAddPostModal={setShowAddPostModal}
          showToast={showToast}
          onPostCreated={onPostCreated}
        />
      )}
    </>
  );
}
