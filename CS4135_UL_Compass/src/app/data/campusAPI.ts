/**
 * Campus data API client
 *
 * Drop-in async replacement for importing from campusData.ts directly.
 * All data now flows through the Express API server, so requests appear
 * in Chrome DevTools Network tab.
 */

const API_BASE = "/api/campus";

// ── Types (same as campusData.ts) ────────────────────────────────

export interface Room {
  id: string;
  name: string;
  building: string;
  buildingFullName: string;
  type: string;
  capacity: number;
  floor: string;
  amenities: string[];
  openingHours: string;
  software?: string[];
  coordinates: { lat: number; lng: number };
}

export interface Building {
  id: string;
  name: string;
  fullName: string;
  type: string;
  coordinates: { lat: number; lng: number };
  description: string;
}

export interface Service {
  id: string;
  name: string;
  type: string;
  openingHours: string;
  coordinates: { lat: number; lng: number };
}

export interface SearchResults {
  rooms: Room[];
  buildings: Building[];
  services: Service[];
}

// ── API functions ────────────────────────────────────────────────

export async function fetchBuildings(): Promise<Building[]> {
  const res = await fetch(`${API_BASE}/buildings`);
  if (!res.ok) throw new Error("Failed to fetch buildings");
  const data = await res.json();
  return data.buildings;
}

export async function fetchRooms(building?: string): Promise<Room[]> {
  const url = building
    ? `${API_BASE}/rooms?building=${encodeURIComponent(building)}`
    : `${API_BASE}/rooms`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch rooms");
  const data = await res.json();
  return data.rooms;
}

export async function fetchRoomById(roomId: string): Promise<Room | null> {
  const res = await fetch(`${API_BASE}/rooms/${encodeURIComponent(roomId)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch room");
  const data = await res.json();
  return data.room;
}

export async function fetchServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/services`);
  if (!res.ok) throw new Error("Failed to fetch services");
  const data = await res.json();
  return data.services;
}

export async function fetchSearch(query: string): Promise<SearchResults> {
  if (!query.trim()) return { rooms: [], buildings: [], services: [] };
  const res = await fetch(
    `${API_BASE}/search?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Failed to search");
  return res.json();
}