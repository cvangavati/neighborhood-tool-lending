import { MaterialIcons } from "@expo/vector-icons";
import { startOAuthLogin } from "@/constants/oauth";
import { Alert, Pressable, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function LoginScreen() {
  const login = async () => { try { await startOAuthLogin(); } catch (error) { Alert.alert("Sign-in unavailable", error instanceof Error ? error.message : "Please try again."); } };
  return <ScreenContainer className="px-5" containerClassName="bg-[#F6F1E8]"><View className="flex-1 justify-center"><View className="h-16 w-16 rounded-2xl bg-[#2F6B4F] items-center justify-center mb-6"><MaterialIcons name="lock" size={30} color="#FFFCF7" /></View><Text className="text-[34px] leading-9 font-bold text-[#1F2924]">Welcome, neighbor</Text><Text className="text-[16px] leading-6 text-[#6D7C73] mt-3">Sign in securely to manage your tools, wishlist, profile, and requests across your devices.</Text><Pressable onPress={login} className="h-14 rounded-2xl bg-[#2F6B4F] items-center justify-center mt-8"><Text className="text-[16px] font-bold text-[#FFFCF7]">Continue with secure sign-in</Text></Pressable><Text className="text-[12px] leading-5 text-[#89948D] text-center mt-5">Your account is handled by the app’s secure OAuth provider. We never store your password.</Text></View></ScreenContainer>;
}
