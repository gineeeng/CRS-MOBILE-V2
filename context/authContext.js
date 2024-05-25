import { createContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../config/firebase";
import axios from "axios";

export const AuthContext = createContext({
  user: null,
  signUp: () => {},
  login: () => {},
  logout: () => {},
  authenticating: false,
  setAuthenticating: () => {},
  setUser: () => {},
  resendVerificationEmail: () => {},
});

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(true);

  async function signUp(email, password) {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await sendEmailVerification(user);

    return user;
  }

  const resendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
      alert("Verification email resent.");
    } catch (error) {
      console.error("Error resending verification email:", error);
    }
  };

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error.code, error.message);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (user.emailVerified) {
          setUser(user);
          await axios({
            method: "put",
            url: `https://${process.env.EXPO_PUBLIC_API_URL}/api/users/${user.uid}`,
            data: { email: user.email },
            headers: { "Content-Type": "application/json" },
          });
        }
      } else {
        setUser(user);
      }
      setLoading(false);
      setAuthenticating(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    setUser,
    signUp,
    login,
    logout,
    authenticating,
    setAuthenticating,
    resendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
