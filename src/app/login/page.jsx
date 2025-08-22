"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from 'next/link';
import Head from 'next/head';
import { useAppActions, useAppState, auth } from '../context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get state and actions from context
  const { isAuthenticated, user } = useAppState();
  const { setUser, setToken, setError: setGlobalError, clearError } = useAppActions();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.email === 'admintradeconnecta@gmail.com' 
        ? '/dashboard/admin' 
        : '/dashboard/user/home';
      router.push(redirectPath);
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await auth.signOut();
        // Context will handle clearing state via onAuthStateChanged
      } catch (error) {
        console.error('Error during sign out:', error);
        setGlobalError(error.message);
      }
    };

    // Handle logout redirect
    const urlParams = new URLSearchParams(window.location.search);
    const fromLogout = urlParams.get('fromLogout') === 'true';
    
    if (fromLogout) {
      handleSignOut();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setGlobalError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    clearError(); // Clear any global errors

    try {
      // Sign in with Firebase
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Get ID token
      const idToken = await user.getIdToken();
      
      // Update global state (this will be handled by the context's auth listener)
      // But we can also manually update to ensure immediate state change
      setUser(user);
      setToken(idToken);
      
      // Redirect based on user role
      if (user.email === 'admintradeconnecta@gmail.com') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/user/home');
      }
      
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please try again.";
      
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password";
          break;
      }
      
      setError(errorMessage);
      setGlobalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>  
      <Head>
        <title>TradeConnect - Login</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="container">
        <div className="left-section">
          <div className="logo-container">
            <div className="logo">
              <img 
                src="/logo.png" 
                alt="TradeConnect Logo"
                onError={(e) => {
                  e.target.src = '/fallback-logo.png';
                  e.target.onerror = null;
                }}
              />
            </div>
            <div className="app-title">TradeConnect</div>
            <div className="description">Welcome back to your local marketplace to Trade, Buy & Sell.</div>
          </div>
        </div>

        <div className="right-section">
          <h2>Login to Your Account</h2>
          
          {error && (
            <div className="error-notice">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email" 
                required 
              />
            </div>

            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                required 
              />
              {password && (
                <i 
                  className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  role="button"
                  tabIndex="0"
                />
              )}
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span> Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="signup-link">
            Don't have an account? <Link href="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
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
          margin-bottom: 15px;
        }

        .input-group i:first-child {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #777;
          z-index: 1;
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
        
        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #777;
          z-index: 2;
        }

        .password-toggle:hover {
          color: var(--primary);
        }

        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          font-size: 13px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }

        .remember-me input {
          margin: 0;
        }

        .forgot-password {
          color: var(--link-blue);
          text-decoration: none;
        }

        .forgot-password:hover {
          text-decoration: underline;
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

        .signup-link {
          text-align: center;
          margin-top: 15px;
          color: #777;
          font-size: 14px;
        }

        .signup-link a {
          color: var(--primary);
          text-decoration: none;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }

        .error-notice {
          background-color: #fde8e8;
          border-left: 4px solid var(--error);
          padding: 15px;
          margin: 15px 0;
          font-size: 14px;
          border-radius: 5px;
          color: var(--error);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .error-notice i {
          font-size: 20px;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          margin-right: 6px;
          vertical-align: middle;
        }

        @keyframes spinAndScale {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
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