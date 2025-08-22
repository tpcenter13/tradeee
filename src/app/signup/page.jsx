"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initializeApp, getApps } from "firebase/app";
import '@fortawesome/fontawesome-free/css/all.min.css';
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import Head from 'next/head';
import Link from 'next/link';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


const firebaseApps = getApps();
const app = firebaseApps.length === 0 ? initializeApp(firebaseConfig) : firebaseApps[0];
const auth = getAuth(app);
const db = getFirestore(app);


const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};


const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 50%)`;
  return color;
};


const generateAvatar = (name, size = 40) => {
  const initials = getInitials(name);
  const backgroundColor = stringToColor(name);
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${backgroundColor}" rx="${size/2}" />
      <text x="50%" y="50%" fill="#ffffff" font-family="Arial, sans-serif" font-size="${size/2}" text-anchor="middle" dy=".35em">
        ${initials}
      </text>
    </svg>
  `;
};


const svgToDataUrl = (svg) => {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [zone, setZone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [error, setError] = useState('');

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    zone: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
  });


  useEffect(() => {
    if (username && username.length >= 2) {
      const avatarSvg = generateAvatar(username);
      const dataUrl = svgToDataUrl(avatarSvg);
      setAvatarUrl(dataUrl);
    } else {
      setAvatarUrl('');
    }
  }, [username]);

  const validateForm = () => {
    const newErrors = {
      username: '',
      email: '',
      zone: '',
      password: '',
      confirmPassword: '',
      adminCode: ''
    };

    let isValid = true;

    if (!username) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!zone || !zone.startsWith("Zone")) {
      newErrors.zone = 'Please select your zone';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (isAdmin && !adminCode) {
      newErrors.adminCode = 'Admin code is required';
      isValid = false;
    } else if (isAdmin && adminCode !== "TRADEADMIN") {
      newErrors.adminCode = 'Invalid admin code';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    
    const isAdminUser = email === 'admintradeconnecta@gmail.com' && adminCode === 'TRADEADMIN';
    
    if (email === 'admintradeconnecta@gmail.com' && adminCode !== 'TRADEADMIN') {
      setError('Invalid admin code');
      return;
    }

    setLoading(true);

    try {
     
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods && methods.length > 0) {
        throw { code: "auth/email-already-in-use" };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const finalAvatarUrl = avatarUrl || svgToDataUrl(generateAvatar(username || email));

      
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        zone,
        role: isAdminUser ? "admin" : "user",
        photoURL: finalAvatarUrl,
        createdAt: new Date().toISOString()
      });

      if (isAdminUser) {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/user');
      }

    } catch (error) {
      console.error("Signup error:", error);
      setFailedAttempts(prev => prev + 1);
      handleSignupError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupError = async (error) => {
    if (error.code === "auth/email-already-in-use") {
      try {
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
       
        const userDoc = doc(db, 'users', user.uid);
        const userData = await getDoc(userDoc);
        
        if (userData.exists()) {
          const data = userData.data();
          if (data.role === 'admin') {
            router.push('/dashboard/admin');
          } else {
            router.push('/dashboard/user');
          }
        }
      } catch (signInError) {
        setErrors(prev => ({
          ...prev,
          email: 'This email is already registered. Please sign in.'
        }));
      }
    } else {
      let errorMessage = "Signup failed. Please try again.";
      let errorField = 'email';
      
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          errorField = 'password';
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        default:
          errorMessage = error.message || "An unexpected error occurred";
      }
      
      setErrors(prev => ({
        ...prev,
        [errorField]: errorMessage
      }));
    }
  };

 
  return (
    <>
      <Head>
        <title>TradeConnect - Sign Up</title>
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
            <div className="description">Trade, Buy & Sell Within Barangay Bulihan, Silang Cavite</div>
          </div>
        </div>

        <div className="right-section">
          <h2>Sign Up</h2>
          
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input 
                type="text" 
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors(prev => ({ ...prev, username: '' }));
                }}
                placeholder="Username" 
                required 
                className={errors.username ? 'error' : username ? 'success' : ''}
              />
              {errors.username && <div className="error-message">{errors.username}</div>}
              {avatarUrl && (
                <div className="avatar-preview-container">
                  <img 
                    src={avatarUrl} 
                    alt="Profile Preview" 
                    className="avatar-preview"
                    onError={(e) => {
                      const fallbackSvg = generateAvatar(username || 'US');
                      e.target.src = svgToDataUrl(fallbackSvg);
                      e.target.onerror = null;
                    }}
                  />
                </div>
              )}
            </div>
            {avatarUrl && (
              <div className="avatar-note-container">
                <span className="avatar-note">Your unique profile picture</span>
              </div>
            )}

            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder="Email" 
                required 
                className={errors.email ? 'error' : email ? 'success' : ''}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="input-group">
              <i className="fas fa-map-marker-alt"></i>
              <select 
                value={zone}
                onChange={(e) => {
                  setZone(e.target.value);
                  setErrors(prev => ({ ...prev, zone: '' }));
                }}
                required
                className={errors.zone ? 'error' : zone ? 'success' : ''}
              >
                <option value="">Select your Zone</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => (
                  <option key={num} value={`Zone ${num}`}>Zone {num}</option>
                ))}
              </select>
              {errors.zone && <div className="error-message">{errors.zone}</div>}
            </div>

            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
                placeholder="Password" 
                required 
                className={errors.password ? 'error' : password ? 'success' : ''}
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
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="Confirm Password" 
                required 
                className={errors.confirmPassword ? 'error' : confirmPassword ? 'success' : ''}
              />
              {confirmPassword && (
                <i 
                  className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  role="button"
                  tabIndex="0"
                />
              )}
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>

            <div className="admin-checkbox">
              <input 
                type="checkbox" 
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => {
                  setIsAdmin(e.target.checked);
                  if (!e.target.checked) {
                    setAdminCode('');
                    setErrors(prev => ({ ...prev, adminCode: '' }));
                  }
                }}
              />
              <label htmlFor="isAdmin">Register as Admin (requires admin code)</label>
            </div>

            {isAdmin && (
              <div className="input-group">
                <i className="fas fa-key"></i>
                <input 
                  type="password" 
                  value={adminCode}
                  onChange={(e) => {
                    setAdminCode(e.target.value);
                    setErrors(prev => ({ ...prev, adminCode: '' }));
                  }}
                  placeholder="Enter Admin Code" 
                  className={errors.adminCode ? 'error' : adminCode ? 'success' : ''}
                />
                {errors.adminCode && <div className="error-message">{errors.adminCode}</div>}
              </div>
            )}

            <div className="terms-privacy">
              By signing up, you agree to our <button type="button" onClick={() => setShowModal(true)} className="terms-link">Terms and Privacy</button>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span> Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="login-link">
            Already have an account? <Link href="/login">Login</Link>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Terms and Conditions</h3>
            <p>By signing up, you agree to the following:</p>
            <p>1. You are a resident of Barangay Bulihan, Silang, Cavite.</p>
            <p>2. You will only use this platform for legitimate trading purposes.</p>
            <p>3. You will not engage in any fraudulent activities.</p>
            <p>4. Your location data will be used for verification purposes only.</p>
            <p>5. The admin reserves the right to verify your identity and location.</p>
            <p>6. Any violation of these terms may result in account suspension.</p>
            <button className="close-modal" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

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

        .input-group input,
        .input-group select {
          width: 100%;
          padding: 10px 40px 10px 40px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 14px;
          transition: all 0.3s;
          position: relative;
        }

        .input-group input:focus,
        .input-group select:focus {
          border-color: var(--primary);
          outline: none;
          box-shadow: 0 0 5px rgba(74, 111, 165, 0.5);
        }

        .input-group input.error,
        .input-group select.error {
          border-color: var(--error);
        }

        .input-group input.success,
        .input-group select.success {
          border-color: var(--success);
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

        .avatar-preview-container {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .avatar-preview {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid var(--primary);
          background-color: white;
          object-fit: cover;
        }

        .avatar-note-container {
          text-align: right;
          margin: -10px 0 15px 0;
        }

        .avatar-note {
          font-size: 11px;
          color: #666;
          font-style: italic;
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

        .login-link {
          text-align: center;
          margin-top: 15px;
          color: #777;
          font-size: 14px;
        }

        .login-link a {
          color: var(--primary);
          text-decoration: none;
        }

        .login-link a:hover {
          text-decoration: underline;
        }

        .admin-checkbox {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .admin-checkbox input {
          margin-right: 8px;
          width: auto;
        }

        .admin-checkbox label {
          font-size: 13px;
        }

        .error-message {
          color: var(--error);
          font-size: 13px;
          margin-top: 5px;
          display: block;
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

        .terms-privacy {
          text-align: center;
          margin: 12px 0;
          font-size: 13px;
          color: #777;
        }

        .terms-link {
          background: none;
          border: none;
          color: var(--link-blue);
          text-decoration: none;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
        }

        .terms-link:hover {
          text-decoration: underline;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 450px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-content h3 {
          margin-bottom: 12px;
          color: var(--secondary);
          font-size: 18px;
        }

        .modal-content p {
          margin-bottom: 8px;
          line-height: 1.4;
          font-size: 14px;
        }

        .close-modal {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 12px;
          float: right;
          font-size: 14px;
        }

        .close-modal:hover {
          opacity: 0.9;
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

          .avatar-note {
            display: none;
          }
        }
      `}</style>
    </>
  );
}