"use client";

import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import styles from "../app/dashboard/user/page.module.css";

export default function AddPostModal({
  isSelling,
  setIsSelling,
  selectedCategory,
  setSelectedCategory,
  postImages,
  handleImageUpload,
  removeImage,
  operationInProgress,
  setShowAddPostModal,
  showToast,
  onPostCreated,
}) {
  const [loading, setLoading] = useState(false);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        showToast("Please log in to create a post");
        setShowAddPostModal(false);
        return;
      }

      const title = e.target.postTitle.value.trim();
      const description = e.target.postDescription.value.trim();
      const quantity = e.target.postQuantity.value;
      const price = isSelling ? e.target.itemPrice.value : null;
      const tradeFor = !isSelling ? e.target.tradeFor.value.trim() : null;

      if (!title || !description || !selectedCategory || !quantity) {
        showToast("Please fill in all required fields");
        return;
      }

      if (postImages.length < 3) {
        showToast("Please upload at least 3 images");
        return;
      }

      const postData = {
        title,
        description,
        category: selectedCategory,
        quantity,
        images: postImages,
        isSelling,
        price,
        tradeFor,
        seller: {
          uid: user.uid,
          email: user.email,
        },
      };

      const res = await fetch("/api/postItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Post created successfully!");
        setShowAddPostModal(false);
        if (onPostCreated) onPostCreated();
      } else {
        showToast(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      showToast("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button
          className={styles.close}
          onClick={() => !loading && setShowAddPostModal(false)}
          aria-label="Close modal"
          disabled={loading}
        >
          &times;
        </button>
        <h3>Create New Listing</h3>
        <p>Fill in the details of the item you want to list</p>
        <form onSubmit={handlePostSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="postTitle">Title*</label>
            <input type="text" id="postTitle" placeholder="Item title..." required disabled={loading} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="postDescription">Description*</label>
            <textarea id="postDescription" placeholder="Describe your item..." required disabled={loading}></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Categories*</label>
            <div className={styles.categoryButtons}>
              {["Fashion & Apparel","Electronics","Food & Beverages","DIY & Hardware","Health & Beauty"].map(category => (
                <button
                  key={category}
                  type="button"
                  className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ""}`}
                  onClick={() => !loading && setSelectedCategory(category)}
                  disabled={loading}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="postQuantity">Quantity*</label>
            <input type="number" id="postQuantity" min="1" defaultValue="1" required disabled={loading} />
          </div>

          <div className={styles.formGroup}>
            <label>Upload Images (Minimum 3)*</label>
            <div className={styles.imageUploadContainer}>
              {postImages.map((image, index) => (
                <div key={index} className={styles.imageUploadBox}>
                  <img src={image} alt={`Preview ${index}`} className={styles.imagePreview} />
                  <button
                    className={styles.removeImage}
                    onClick={() => !loading && removeImage(index)}
                    aria-label="Remove image"
                    disabled={loading}
                  >
                    &times;
                  </button>
                </div>
              ))}
              {postImages.length < 6 && (
                <div className={styles.imageUploadBox}>
                  <input type="file" accept="image/*" className={styles.imageUploadInput} onChange={handleImageUpload} multiple disabled={loading} />
                  <span className={styles.imageUploadText}>+ Add Image</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>I want to:*</label>
            <div className={styles.switchContainer}>
              <label className={styles.switch}>
                <input type="checkbox" checked={isSelling} onChange={() => !loading && setIsSelling(!isSelling)} disabled={loading} />
                <span className={`${styles.slider} ${styles.round}`}>
                  <span className={styles.tradeText}>Trade</span>
                  <span className={styles.sellText}>Sell</span>
                </span>
              </label>
            </div>

            {isSelling ? (
              <div className={styles.priceInput}>
                <label htmlFor="itemPrice">Price (₱)*</label>
                <input type="number" id="itemPrice" min="1" placeholder="Enter amount" required disabled={loading} />
              </div>
            ) : (
              <div>
                <label htmlFor="tradeFor">Willing to trade for:</label>
                <textarea id="tradeFor" placeholder="What items would you accept in trade?" disabled={loading}></textarea>
              </div>
            )}
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Posting...
              </>
            ) : (
              <>
                <i className="fas fa-upload"></i> Post Item
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
