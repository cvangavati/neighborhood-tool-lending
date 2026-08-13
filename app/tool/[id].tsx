import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppState } from "@/lib/app-state";

export default function ToolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tools, requestTool, isWishlisted, toggleWishlist, profile } = useAppState();
  const tool = tools.find((item) => item.id === id);
  if (!tool) return <ScreenContainer className="p-5"><Text className="text-lg text-[#1F2924]">Tool not found.</Text></ScreenContainer>;
  const canRequest = tool.status === "available" && !tool.isMine;
  const handleRequest = () => {
    const request = requestTool(tool);
    Alert.alert("Request sent", "Your neighbor can now reply with pickup details.", [{ text: "Open conversation", onPress: () => router.replace({ pathname: "/request/[id]", params: { id: request.id } }) }]);
  };
  return <ScreenContainer className="px-5" containerClassName="bg-[#F6F1E8]"><View className="pt-4"><View className="flex-row items-center justify-between mb-6"><Pressable onPress={() => router.back()} className="h-10 w-10 rounded-full bg-[#FFFCF7] items-center justify-center"><MaterialIcons name="arrow-back" size={22} color="#1F2924" /></Pressable><Pressable onPress={() => toggleWishlist(tool.id)} className="h-10 w-10 rounded-full bg-[#FFFCF7] items-center justify-center"><MaterialIcons name={isWishlisted(tool.id) ? "favorite" : "favorite-border"} size={22} color={isWishlisted(tool.id) ? "#B84C3A" : "#6D7C73"} /></Pressable></View><View style={{ backgroundColor: tool.accent }} className="h-56 rounded-[28px] items-center justify-center"><MaterialIcons name={tool.icon as keyof typeof MaterialIcons.glyphMap} size={92} color="#2F6B4F" /></View><View className="flex-row items-center justify-between mt-7"><View className="flex-1"><Text className="text-[30px] leading-9 font-bold text-[#1F2924]">{tool.name}</Text><Text className="text-[15px] text-[#6D7C73] mt-2">{tool.owner}  ·  {tool.neighborhood}  ·  {tool.distance}</Text>{tool.owner === "You" ? <Text className="text-[13px] text-[#526159] mt-2">{profile.bio}{profile.street ? ` · Near ${profile.street}` : ""}</Text> : <Text className="text-[13px] text-[#526159] mt-2">Neighbor in {tool.neighborhood} · local pickup arranged by message</Text>}</View><View className={`rounded-full px-3 py-2 ${tool.status === "available" ? "bg-[#E3F1E7]" : "bg-[#F5E9D2]"}`}><Text className={`text-xs font-bold ${tool.status === "available" ? "text-[#31714E]" : "text-[#9A6617]"}`}>{tool.status === "available" ? "AVAILABLE" : "BORROWED"}</Text></View></View><Text className="text-[17px] leading-7 text-[#526159] mt-7">{tool.description}</Text><View className="bg-[#EDE5D8] rounded-2xl p-4 mt-7 flex-row"><MaterialIcons name="handshake" size={24} color="#2F6B4F" /><Text className="flex-1 ml-3 text-[14px] leading-5 text-[#526159]">Keep it neighborly: ask about pickup timing and return the tool in the same condition.</Text></View><Pressable disabled={!canRequest} onPress={handleRequest} style={({ pressed }) => [{ opacity: pressed ? 0.85 : canRequest ? 1 : 0.55 }]} className="bg-[#2F6B4F] rounded-2xl h-14 items-center justify-center mt-8"><Text className="text-[#FFFCF7] text-[16px] font-bold">{tool.isMine ? "This is your tool" : tool.status === "available" ? "Request to borrow" : "Currently borrowed"}</Text></Pressable></View></ScreenContainer>;
}
