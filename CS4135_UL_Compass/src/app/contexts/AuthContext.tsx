import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = "/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // On mount, check if we have a stored token and validate it
  useEffect(() => {
    const token = localStorage.getItem("ul_compass_token");
    if (token) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid session");
          return res.json();
        })
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          // Token is invalid or expired — clear it
          localStorage.removeItem("ul_compass_token");
        });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();
      localStorage.setItem("ul_compass_token", data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();
      localStorage.setItem("ul_compass_token", data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error("Registration error:", err);
      return false;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("ul_compass_token");

    // Fire the logout request (best-effort — clear local state regardless)
    if (token) {
      fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }

    localStorage.removeItem("ul_compass_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
