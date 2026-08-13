import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { communities, useAppState, type Community } from "@/lib/app-state";

export default function CommunityScreen() {
  const { selectCommunity, community } = useAppState();
  const choose = (next: Community) => { selectCommunity(next); router.replace("/(tabs)"); };
  return <ScreenContainer className="px-5" containerClassName="bg-[#F6F1E8]"><View className="flex-1 justify-center"><View className="mb-8"><View className="h-14 w-14 rounded-2xl bg-[#2F6B4F] items-center justify-center mb-5"><MaterialIcons name="handshake" size={30} color="#FFFCF7" /></View><Text className="text-[32px] leading-9 font-bold text-[#1F2924]">Choose your community</Text><Text className="text-[16px] leading-6 text-[#6D7C73] mt-3">Start with the neighborhood or community you want to share with. You can change this later.</Text></View>{communities.map((item) => <Pressable key={item.id} onPress={() => choose(item)} style={({ pressed }) => [{ opacity: pressed ? 0.78 : 1 }]} className="bg-[#FFFCF7] border border-[#E5DED1] rounded-2xl p-4 mb-3 flex-row items-center"><View className="h-12 w-12 rounded-xl bg-[#D9E9DB] items-center justify-center"><MaterialIcons name="location-city" size={24} color="#2F6B4F" /></View><View className="flex-1 ml-3"><Text className="text-[17px] font-bold text-[#1F2924]">{item.name}</Text><Text className="text-[13px] leading-5 text-[#6D7C73] mt-1">{item.description}</Text><Text className="text-[12px] font-semibold text-[#2F6B4F] mt-2">{item.members}</Text></View><MaterialIcons name={community?.id === item.id ? "check-circle" : "chevron-right"} size={24} color={community?.id === item.id ? "#2F6B4F" : "#9AA49D"} /></Pressable>)}<Text className="text-[12px] leading-5 text-[#89948D] text-center mt-5">Your board, wishlist, requests, and profile are organized around this community.</Text></View></ScreenContainer>;
}
