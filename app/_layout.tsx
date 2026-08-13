import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppStateProvider } from "@/lib/app-state";
import { ThemeProvider } from "@/lib/theme-provider";
import "../global.css";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="tool/[id]" />
          <Stack.Screen name="add-tool" options={{ presentation: "modal" }} />
          <Stack.Screen name="request/[id]" />
        </Stack>
      </AppStateProvider>
    </ThemeProvider>
  );
}
