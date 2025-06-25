import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config"; // adjust path if needed
import axios from "axios";

// Create context
export const AuthContext = createContext();

// Google provider
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register
  const register = (email, password, name, photoURL) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).then((res) => {
      updateProfile(res.user, {
        displayName: name,
        photoURL: photoURL,
      });
      return res;
    });
  };

  // Login
  const login = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google login
  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Logout
  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("stayEase-token");
    return signOut(auth);
  };

  // Track auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // JWT logic
      if (currentUser) {
        currentUser.getIdToken().then((token) => {
          axios
            .post("https://hotel-booking-platform-server-pi.vercel.app//jwt", { email: currentUser.email }) 
            .then((res) => {
              localStorage.setItem("stayEase-token", res.data.token);
            });
        });
      } else {
        localStorage.removeItem("stayEase-token");
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    logOut,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};
