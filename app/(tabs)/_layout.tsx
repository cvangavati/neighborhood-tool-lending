import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#2F6B4F", tabBarInactiveTintColor: "#89948D", tabBarButton: HapticTab, tabBarStyle: { paddingTop: 8, paddingBottom: bottomPadding, height: 56 + bottomPadding, backgroundColor: "#FFFCF7", borderTopColor: "#E5DED1", borderTopWidth: 0.5 } }}><Tabs.Screen name="index" options={{ title: "Nearby", tabBarIcon: ({ color }) => <MaterialIcons name="explore" size={25} color={color} /> }} /><Tabs.Screen name="requests" options={{ title: "Requests", tabBarIcon: ({ color }) => <MaterialIcons name="forum" size={24} color={color} /> }} /><Tabs.Screen name="profile" options={{ title: "My shelf", tabBarIcon: ({ color }) => <MaterialIcons name="inventory-2" size={23} color={color} /> }} /></Tabs>;
}
