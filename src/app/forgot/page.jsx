"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase"; // ✅ use shared Firebase instance
import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link";
import Head from "next/head";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Please check your inbox.");
    } catch (error) {
      console.error("Password reset error:", error);
      let errorMessage = "Failed to send reset email. Please try again.";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        default:
          errorMessage = error.message || "An unexpected error occurred";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>TradeConnect - Forgot Password</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="container">
        <div className="left-section">
          <div className="logo-container">
            <div className="logo">
              <img
                src="/logo.png"
                alt="TradeConnect Logo"
                onError={(e) => {
                  e.target.src = "/fallback-logo.png";
                  e.target.onerror = null;
                }}
              />
            </div>
            <div className="app-title">TradeConnect</div>
            {success ? (
              <div className="description">
                Help Is on the Way 💌 We've sent a gentle little reset link to
                your inbox. Just follow the steps and you'll be back in soon.
              </div>
            ) : (
              <div className="description">
                Trade, Buy & Sell Within Barangay Bulihan, Silang Cavite
              </div>
            )}
          </div>
        </div>

        <div className="right-section">
          <h2>Forgot Password</h2>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {!success ? (
            <form onSubmit={handleResetPassword}>
              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading-spinner"></span> Sending...
                  </>
                ) : (
                  "Send Email"
                )}
              </button>
            </form>
          ) : (
            <div className="success-actions">
              <button onClick={() => router.push("/login")}>
                Back to Login
              </button>
            </div>
          )}

          {!success && (
            <div className="remembered-password">
              Remembered your password? <Link href="/login">Back to Login</Link>
            </div>
          )}
        </div>
      </div>

      {/* ✅ keep your CSS exactly as you had it */}
      <style jsx global>{`
        :root {
          --primary: #4a6fa5;
          --secondary: #166088;
          --error: #e74c3c;
          --success: #2ecc71;
          --light-gray: #f5f5f5;
          --dark-gray: #333;
          --link-blue: #1a73e8;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Open Sans", sans-serif;
        }
        body {
          background-color: var(--light-gray);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          display: flex;
          max-width: 900px;
          width: 100%;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          flex-wrap: wrap;
        }
        .left-section {
          flex: 1;
          min-width: 300px;
          padding: 40px 20px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
        }
        .logo-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 15px;
        }
        .logo {
          width: 70px;
          height: 70px;
          background-color: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 10px;
        }
        .logo img {
          width: 50px;
          height: 50px;
          object-fit: contain;
          animation: spinAndScale 3s linear infinite;
        }
        .app-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .description {
          font-size: 14px;
          line-height: 1.4;
          max-width: 280px;
        }
        .right-section {
          flex: 1;
          min-width: 300px;
          padding: 40px 30px;
          color: var(--dark-gray);
        }
        .right-section h2 {
          text-align: center;
          margin-bottom: 20px;
          font-size: 22px;
          color: var(--secondary);
        }
        .input-group {
          position: relative;
          margin-bottom: 20px;
        }
        .input-group i:first-child {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #777;
        }
        .input-group input {
          width: 100%;
          padding: 10px 40px 10px 40px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 14px;
          transition: all 0.3s;
        }
        .input-group input:focus {
          border-color: var(--primary);
          outline: none;
          box-shadow: 0 0 5px rgba(74, 111, 165, 0.5);
        }
        button {
          width: 100%;
          padding: 10px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s ease;
        }
        button:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
        button:disabled {
          background: #cccccc;
          cursor: not-allowed;
          transform: none;
        }
        .remembered-password {
          text-align: center;
          margin-top: 15px;
          color: #777;
          font-size: 14px;
        }
        .remembered-password a {
          color: var(--primary);
          text-decoration: none;
        }
        .remembered-password a:hover {
          text-decoration: underline;
        }
        .error-message {
          color: var(--error);
          font-size: 14px;
          margin-bottom: 15px;
          text-align: center;
          padding: 10px;
          background-color: rgba(231, 76, 60, 0.1);
          border-radius: 5px;
        }
        .success-message {
          color: var(--success);
          font-size: 14px;
          margin-bottom: 15px;
          text-align: center;
          padding: 10px;
          background-color: rgba(46, 204, 113, 0.1);
          border-radius: 5px;
        }
        .success-actions {
          margin-top: 20px;
        }
        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          margin-right: 6px;
          vertical-align: middle;
        }
        @keyframes spinAndScale {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.1);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (max-width: 768px) {
          .container {
            flex-direction: column;
          }
          .left-section,
          .right-section {
            padding: 25px;
          }
        }
      `}</style>
    </>
  );
}
