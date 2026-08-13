import { Stack, router, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { useEffect } from "react";
import { AppStateProvider, useAppState } from "@/lib/app-state";
import { ThemeProvider } from "@/lib/theme-provider";
import "../global.css";

function AppGate() {
  const { community, hasHydrated } = useAppState();
  const pathname = usePathname();
  useEffect(() => { if (hasHydrated && !community && pathname !== "/community") router.replace("/community"); }, [hasHydrated, community, pathname]);
  if (!hasHydrated) return <View className="flex-1 items-center justify-center bg-[#F6F1E8]"><Text className="text-[#6D7C73]">Preparing your community board…</Text></View>;
  if (!community && pathname !== "/community") return null;
  return <><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false }}><Stack.Screen name="community" options={{ presentation: "fullScreenModal" }} /><Stack.Screen name="(tabs)" /><Stack.Screen name="tool/[id]" /><Stack.Screen name="add-tool" options={{ presentation: "modal" }} /><Stack.Screen name="request/[id]" /></Stack></>;
}

export default function RootLayout() {
  return <ThemeProvider><AppStateProvider><AppGate /></AppStateProvider></ThemeProvider>;
}
