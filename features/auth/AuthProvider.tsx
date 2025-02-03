import { createContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";

type AuthContextProps = {
  currentUser: User | null;
  isAuthStateChecking: boolean;
}

export const authContext = createContext<AuthContextProps>({
  currentUser: null,
  isAuthStateChecking: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthStateChecking, setIsAuthStateChecking] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {

      setCurrentUser(user);
      setIsAuthStateChecking(true);
    });
    return () => unsubscribe();
  }, []);

  if (!isAuthStateChecking) {
    return <div>Loading...</div>;
  }

  return (
    <authContext.Provider
      value={{ currentUser, isAuthStateChecking }}
    >
      {children}
    </authContext.Provider>
  );
}

