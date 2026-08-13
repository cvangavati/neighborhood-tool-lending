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

const seedTools: Tool[] = [
  { id: "1", name: "Cordless drill", category: "Power tools", description: "18V drill with two batteries and a set of bits. Great for shelves, fixtures, and weekend projects.", owner: "Maya R.", neighborhood: "Maplewood", distance: "0.2 mi", status: "available", icon: "construction", accent: "#D9E9DB" },
  { id: "2", name: "Hedge trimmer", category: "Garden", description: "Quiet electric trimmer for shaping hedges and clearing small branches.", owner: "Andre P.", neighborhood: "Maplewood", distance: "0.4 mi", status: "available", icon: "park", accent: "#F0E5C8" },
  { id: "3", name: "Wet/dry vacuum", category: "Cleaning", description: "Compact shop vacuum for sawdust, spills, and messy home projects.", owner: "Lena K.", neighborhood: "Maplewood", distance: "0.7 mi", status: "borrowed", icon: "cleaning-services", accent: "#DDE4EE" },
  { id: "4", name: "Folding ladder", category: "Outdoor", description: "Six-foot folding ladder that fits in a small car and stores flat.", owner: "You", neighborhood: "Maplewood", distance: "0.0 mi", status: "available", icon: "stairs", accent: "#F4D8C8", isMine: true },
];
const seedRequests: BorrowRequest[] = [
  { id: "r1", toolId: "1", toolName: "Cordless drill", neighbor: "You", direction: "sent", status: "pending", preview: "Could I borrow this Saturday morning?", messages: [{ id: "m1", sender: "You", body: "Could I borrow this Saturday morning?", timestamp: "9:41 AM" }] },
  { id: "r2", toolId: "4", toolName: "Folding ladder", neighbor: "Sam T.", direction: "received", status: "accepted", preview: "I can pick it up after work.", messages: [{ id: "m2", sender: "Sam T.", body: "I can pick it up after work.", timestamp: "Yesterday" }, { id: "m3", sender: "You", body: "That works. It will be by the front steps.", timestamp: "Yesterday" }] },
];
const seedProfile: UserProfile = { name: "You", neighborhood: "Maplewood", street: "", bio: "Neighbor who likes sharing useful things." };

type AppState = { tools: Tool[]; requests: BorrowRequest[]; wishlist: string[]; profile: UserProfile; addTool: (tool: Omit<Tool, "id" | "owner" | "neighborhood" | "distance" | "isMine">) => void; toggleToolStatus: (id: string) => void; isWishlisted: (id: string) => boolean; toggleWishlist: (id: string) => void; requestTool: (tool: Tool) => BorrowRequest; sendMessage: (requestId: string, body: string, pickup?: PickupProposal) => void; proposePickup: (requestId: string, proposal: Omit<PickupProposal, "id" | "status">) => void; respondToPickup: (requestId: string, status: "accepted" | "declined") => void; updateProfile: (profile: UserProfile) => void };
const StateContext = createContext<AppState | null>(null);
const STORAGE_KEY = "neighborhood-tool-lending-state-v2";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [tools, setTools] = useState(seedTools); const [requests, setRequests] = useState(seedRequests); const [wishlist, setWishlist] = useState<string[]>(["2"]); const [profile, setProfile] = useState(seedProfile);
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
