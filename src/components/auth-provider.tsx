"use client";

import { createContext, useContext, useState, useEffect, useCallback, startTransition } from "react";

interface User {
  email: string;
  firstName: string;
  lastName: string;
  isSeller: boolean;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "stepforward_user";

// Emaile aktywnych sprzedawców z co najmniej 20 transakcjami (mock — zastąp prawdziwym API)
const MOCK_SELLER_EMAILS = [
  "anna@avintage.pl",
  "seller@fashionhero.pl",
  "test.seller@example.com",
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        startTransition(() => setUser(JSON.parse(stored)));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = useCallback(async (email: string, _password: string) => {
    // Mock login — always succeeds
    const newUser: User = {
      email,
      firstName: email.split("@")[0],
      lastName: "",
      isSeller: MOCK_SELLER_EMAILS.includes(email.toLowerCase()),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const register = useCallback(async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const newUser: User = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      isSeller: false, // nowi użytkownicy nie są od razu sprzedawcami
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
