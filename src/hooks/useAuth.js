"use client";

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

export function useAuth() {
  const {
    user,
    setUser,
    userId,
    logout,
    isLoading,
    setIsLoading,
    showSignInDialog,
    setShowSignInDialog,
  } = useContext(AuthContext);

  const isSignedIn = !!user;



  return {
    user,
    userId,
    isSignedIn,
    isLoading,
    showSignInDialog,
    setShowSignInDialog,
    
   
    logout,
  };
}
