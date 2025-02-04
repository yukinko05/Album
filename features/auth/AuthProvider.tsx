"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { Spinner } from "@nextui-org/spinner";

type AuthContextProps = {
  currentUser: User | null;
  isAuthStateChecking: boolean;
};

export const authContext = createContext<AuthContextProps>({
  currentUser: null,
  isAuthStateChecking: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthStateChecking, setIsAuthStateChecking] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        setCurrentUser(user);
        setIsAuthStateChecking(true);
      } catch (error) {
        console.error("Auth state change error:", error);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!isAuthStateChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <authContext.Provider value={{ currentUser, isAuthStateChecking }}>
      {children}
    </authContext.Provider>
  );
};
