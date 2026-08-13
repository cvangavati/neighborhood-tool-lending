import { Stack, router, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { useEffect } from "react";
import { AppStateProvider, useAppState } from "@/lib/app-state";
import { ThemeProvider } from "@/lib/theme-provider";
import { TRPCProvider } from "@/lib/trpc-provider";
import { useAuth } from "@/hooks/use-auth";
import "../global.css";

function AppGate() {
  const { community, hasHydrated } = useAppState();
  const { isAuthenticated, loading: authLoading, refresh } = useAuth();
  const pathname = usePathname();
  useEffect(() => { if (!authLoading && !isAuthenticated && pathname !== "/login" && pathname !== "/oauth/callback") router.replace("/login"); }, [authLoading, isAuthenticated, pathname]);
  useEffect(() => { if (pathname === "/(tabs)" || pathname === "/community") refresh(); }, [pathname, refresh]);
  useEffect(() => { if (hasHydrated && isAuthenticated && !community && pathname !== "/community" && pathname !== "/login" && pathname !== "/oauth/callback") router.replace("/community"); }, [hasHydrated, isAuthenticated, community, pathname]);
  if (authLoading || !hasHydrated) return <View className="flex-1 items-center justify-center bg-[#F6F1E8]"><Text className="text-[#6D7C73]">Preparing your secure community board…</Text></View>;
  if (!isAuthenticated && pathname !== "/login" && pathname !== "/oauth/callback") return null;
  if (isAuthenticated && !community && pathname !== "/community" && pathname !== "/login" && pathname !== "/oauth/callback") return null;
  return <><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false }}><Stack.Screen name="login" options={{ presentation: "fullScreenModal" }} /><Stack.Screen name="oauth/callback" /><Stack.Screen name="community" options={{ presentation: "fullScreenModal" }} /><Stack.Screen name="(tabs)" /><Stack.Screen name="tool/[id]" /><Stack.Screen name="add-tool" options={{ presentation: "modal" }} /><Stack.Screen name="request/[id]" /></Stack></>;
}

export default function RootLayout() { return <ThemeProvider><TRPCProvider><AppStateProvider><AppGate /></AppStateProvider></TRPCProvider></ThemeProvider>; }
