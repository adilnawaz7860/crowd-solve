"use client";

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);

  
  const [isLoading, setIsLoading] = useState(true);
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  const fetchUser = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      

      if (res.ok && data?.user) {
        setUser(data.user);
        setUserId(data?.user?._id)
      } else {
        setUser(null);
        sessionStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Fetch user error:", err);
      setUser(null);
      sessionStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userId,
        logout,
        isLoading,
        setIsLoading,
        showSignInDialog,
        setShowSignInDialog,
        refetchUser: fetchUser, // ← expose fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

