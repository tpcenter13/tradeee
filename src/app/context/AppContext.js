"use client";
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Firebase config (you should move this to a separate config file)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  userRole: null,
  token: null,
  posts: [],
  userProfile: null,
};

// Action types
const ActionTypes = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_TOKEN: 'SET_TOKEN',
  SET_USER_ROLE: 'SET_USER_ROLE',
  SET_POSTS: 'SET_POSTS',
  ADD_POST: 'ADD_POST',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  LOGOUT: 'LOGOUT',
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        userRole: action.payload?.email === 'admintradeconnecta@gmail.com' ? 'admin' : 'user',
      };
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case ActionTypes.SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case ActionTypes.SET_USER_ROLE:
      return {
        ...state,
        userRole: action.payload,
      };
    case ActionTypes.SET_POSTS:
      return {
        ...state,
        posts: action.payload,
      };
    case ActionTypes.ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case ActionTypes.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map(post => 
          post.id === action.payload.id ? action.payload : post
        ),
      };
    case ActionTypes.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
      };
    case ActionTypes.SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };
    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };
    default:
      return state;
  }
}

// Create contexts
const AppStateContext = createContext();
const AppDispatchContext = createContext();

// Custom hooks for using context
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within AppProvider');
  }
  return context;
};

// Custom hook for common actions
export const useAppActions = () => {
  const dispatch = useAppDispatch();

  return {
    setUser: (user) => dispatch({ type: ActionTypes.SET_USER, payload: user }),
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    setToken: (token) => dispatch({ type: ActionTypes.SET_TOKEN, payload: token }),
    setUserRole: (role) => dispatch({ type: ActionTypes.SET_USER_ROLE, payload: role }),
    setPosts: (posts) => dispatch({ type: ActionTypes.SET_POSTS, payload: posts }),
    addPost: (post) => dispatch({ type: ActionTypes.ADD_POST, payload: post }),
    updatePost: (post) => dispatch({ type: ActionTypes.UPDATE_POST, payload: post }),
    deletePost: (postId) => dispatch({ type: ActionTypes.DELETE_POST, payload: postId }),
    setUserProfile: (profile) => dispatch({ type: ActionTypes.SET_USER_PROFILE, payload: profile }),
    logout: () => dispatch({ type: ActionTypes.LOGOUT }),
  };
};

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get the ID token
          const token = await user.getIdToken();
          
          // Update state with user and token
          dispatch({ type: ActionTypes.SET_USER, payload: user });
          dispatch({ type: ActionTypes.SET_TOKEN, payload: token });
          
          // Set cookies
          const cookieOptions = {
            path: '/',
            maxAge: 3600,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          };
          
          const cookieString = (name, value) => {
            return `${name}=${value}; ` +
                   `path=${cookieOptions.path}; ` +
                   `max-age=${cookieOptions.maxAge}; ` +
                   `samesite=${cookieOptions.sameSite}` +
                   (cookieOptions.secure ? '; secure' : '');
          };
          
          document.cookie = cookieString('token', token);
          document.cookie = cookieString('userEmail', user.email);
          
        } catch (error) {
          console.error('Error getting token:', error);
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        }
      } else {
        // User is signed out
        dispatch({ type: ActionTypes.SET_USER, payload: null });
        dispatch({ type: ActionTypes.SET_TOKEN, payload: null });
        
        // Clear cookies
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    });

    // Check for existing cookies on mount
    const checkExistingAuth = () => {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});

      if (cookies.token && cookies.userEmail) {
        dispatch({ type: ActionTypes.SET_TOKEN, payload: cookies.token });
      }
    };

    checkExistingAuth();

    return () => unsubscribe();
  }, []);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

// Export auth instance for use in other components
export { auth };
export { ActionTypes };