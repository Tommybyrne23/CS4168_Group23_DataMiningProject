import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (itemId: string, type: "room" | "building" | "service") => void;
  removeFavorite: (itemId: string, type: "room" | "building" | "service") => void;
  isFavorite: (itemId: string, type: "room" | "building" | "service") => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("ul_compass_token");
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();

  // Load favorites from API when user changes
  useEffect(() => {
    if (user) {
      const token = getToken();
      if (token) {
        fetch(`${API_BASE}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to load favorites");
            return res.json();
          })
          .then((data) => {
            setFavorites(data.favorites || []);
          })
          .catch((err) => {
            console.error("Error loading favorites:", err);
            setFavorites([]);
          });
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  const addFavorite = async (itemId: string, type: "room" | "building" | "service") => {
    if (!user) return;

    const token = getToken();
    if (!token) return;

    const favoriteId = `${type}:${itemId}`;
    // Optimistic update
    setFavorites((prev) => [...prev, favoriteId]);

    try {
      const res = await fetch(`${API_BASE}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId, type }),
      });

      if (!res.ok) {
        // Revert on failure
        setFavorites((prev) => prev.filter((id) => id !== favoriteId));
      }
    } catch (err) {
      console.error("Error adding favorite:", err);
      setFavorites((prev) => prev.filter((id) => id !== favoriteId));
    }
  };

  const removeFavorite = async (itemId: string, type: "room" | "building" | "service") => {
    if (!user) return;

    const token = getToken();
    if (!token) return;

    const favoriteId = `${type}:${itemId}`;
    // Optimistic update
    setFavorites((prev) => prev.filter((id) => id !== favoriteId));

    try {
      const res = await fetch(`${API_BASE}/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        // Revert on failure
        setFavorites((prev) => [...prev, favoriteId]);
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
      setFavorites((prev) => [...prev, favoriteId]);
    }
  };

  const isFavorite = (itemId: string, type: "room" | "building" | "service") => {
    const favoriteId = `${type}:${itemId}`;
    return favorites.includes(favoriteId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
