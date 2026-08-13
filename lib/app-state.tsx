import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ToolCategory = "Power tools" | "Garden" | "Hand tools" | "Cleaning" | "Outdoor";
export type ToolStatus = "available" | "borrowed";
export type RequestStatus = "pending" | "accepted" | "declined";
export type PickupProposal = { id: string; date: string; time: string; note: string; status: "proposed" | "accepted" | "declined" };
export type UserProfile = { name: string; neighborhood: string; street: string; bio: string };
export type Tool = { id: string; name: string; category: ToolCategory; description: string; owner: string; neighborhood: string; distance: string; status: ToolStatus; icon: string; accent: string; isMine?: boolean };
export type Message = { id: string; sender: string; body: string; timestamp: string; pickup?: PickupProposal };
export type BorrowRequest = { id: string; toolId: string; toolName: string; neighbor: string; direction: "sent" | "received"; status: RequestStatus; preview: string; messages: Message[]; pickup?: PickupProposal };

const seedTools: Tool[] = [];
const seedRequests: BorrowRequest[] = [];
const seedProfile: UserProfile = { name: "", neighborhood: "Your neighborhood", street: "", bio: "" };

type AppState = { tools: Tool[]; requests: BorrowRequest[]; wishlist: string[]; profile: UserProfile; addTool: (tool: Omit<Tool, "id" | "owner" | "neighborhood" | "distance" | "isMine">) => void; toggleToolStatus: (id: string) => void; isWishlisted: (id: string) => boolean; toggleWishlist: (id: string) => void; requestTool: (tool: Tool) => BorrowRequest; sendMessage: (requestId: string, body: string, pickup?: PickupProposal) => void; proposePickup: (requestId: string, proposal: Omit<PickupProposal, "id" | "status">) => void; respondToPickup: (requestId: string, status: "accepted" | "declined") => void; updateProfile: (profile: UserProfile) => void };
const StateContext = createContext<AppState | null>(null);
const STORAGE_KEY = "neighborhood-tool-lending-state-v3-clean";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [tools, setTools] = useState<Tool[]>(seedTools); const [requests, setRequests] = useState<BorrowRequest[]>(seedRequests); const [wishlist, setWishlist] = useState<string[]>([]); const [profile, setProfile] = useState<UserProfile>(seedProfile);
  useEffect(() => { AsyncStorage.getItem(STORAGE_KEY).then((raw) => { if (!raw) return; try { const parsed = JSON.parse(raw); if (Array.isArray(parsed.tools)) setTools(parsed.tools); if (Array.isArray(parsed.requests)) setRequests(parsed.requests); if (Array.isArray(parsed.wishlist)) setWishlist(parsed.wishlist); if (parsed.profile) setProfile(parsed.profile); } catch { /* Keep safe defaults if local storage is unavailable. */ } }); }, []);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ tools, requests, wishlist, profile })); }, [tools, requests, wishlist, profile]);
  const value = useMemo<AppState>(() => ({
    tools, requests, wishlist, profile,
    addTool: (tool) => setTools((current) => [{ ...tool, id: `tool-${Date.now()}`, owner: "You", neighborhood: profile.neighborhood, distance: "0.0 mi", isMine: true }, ...current]),
    toggleToolStatus: (id) => setTools((current) => current.map((tool) => tool.id === id ? { ...tool, status: tool.status === "available" ? "borrowed" : "available" } : tool)),
    isWishlisted: (id) => wishlist.includes(id),
    toggleWishlist: (id) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
    requestTool: (tool) => { const request: BorrowRequest = { id: `request-${Date.now()}`, toolId: tool.id, toolName: tool.name, neighbor: "You", direction: "sent", status: "pending", preview: "Could I borrow this soon?", messages: [{ id: `message-${Date.now()}`, sender: "You", body: "Could I borrow this soon?", timestamp: "Just now" }] }; setRequests((current) => [request, ...current]); return request; },
    sendMessage: (requestId, body, pickup) => setRequests((current) => current.map((request) => request.id === requestId ? { ...request, preview: body, messages: [...request.messages, { id: `message-${Date.now()}`, sender: "You", body, timestamp: "Just now", pickup }] } : request)),
    proposePickup: (requestId, proposal) => setRequests((current) => current.map((request) => request.id === requestId ? { ...request, pickup: { ...proposal, id: `pickup-${Date.now()}`, status: "proposed" }, preview: `Pickup proposed for ${proposal.date} at ${proposal.time}`, messages: [...request.messages, { id: `message-${Date.now()}`, sender: "You", body: `How about ${proposal.date} at ${proposal.time}? ${proposal.note}`, timestamp: "Just now", pickup: { ...proposal, id: `pickup-${Date.now()}`, status: "proposed" } }] } : request)),
    respondToPickup: (requestId, status) => setRequests((current) => current.map((request) => request.id === requestId && request.pickup ? { ...request, pickup: { ...request.pickup, status }, preview: status === "accepted" ? `Pickup agreed for ${request.pickup.date} at ${request.pickup.time}` : "Pickup time declined" } : request)),
    updateProfile: (nextProfile) => setProfile(nextProfile),
  }), [tools, requests, wishlist, profile]);
  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}
export function useAppState() { const state = useContext(StateContext); if (!state) throw new Error("useAppState must be used inside AppStateProvider"); return state; }
