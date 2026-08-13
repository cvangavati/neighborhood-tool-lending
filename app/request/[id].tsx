import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppState } from "@/lib/app-state";

export default function RequestConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { requests, sendMessage } = useAppState();
  const request = requests.find((item) => item.id === id);
  const [draft, setDraft] = useState("");
  if (!request) return <ScreenContainer className="p-5"><Text className="text-lg text-[#1F2924]">Conversation not found.</Text></ScreenContainer>;
  const submit = () => { if (!draft.trim()) return; sendMessage(request.id, draft.trim()); setDraft(""); };
  return <ScreenContainer className="px-5" containerClassName="bg-[#F6F1E8]"><View className="flex-row items-center pt-4 pb-5"><Pressable onPress={() => router.back()} className="h-10 w-10 rounded-full bg-[#FFFCF7] items-center justify-center"><MaterialIcons name="arrow-back" size={22} color="#1F2924" /></Pressable><View className="ml-4"><Text className="text-[20px] font-bold text-[#1F2924]">{request.toolName}</Text><Text className="text-[13px] text-[#6D7C73]">{request.direction === "sent" ? "Request sent" : `From ${request.neighbor}`}</Text></View></View><FlatList data={request.messages} keyExtractor={(item) => item.id} contentContainerStyle={{ gap: 12, paddingVertical: 10, flexGrow: 1 }} renderItem={({ item }) => <View className={`max-w-[82%] rounded-2xl px-4 py-3 ${item.sender === "You" ? "self-end bg-[#2F6B4F] rounded-br-md" : "self-start bg-[#FFFCF7] border border-[#E5DED1] rounded-bl-md"}`}><Text className={`text-[15px] leading-5 ${item.sender === "You" ? "text-[#FFFCF7]" : "text-[#1F2924]"}`}>{item.body}</Text><Text className={`text-[11px] mt-2 ${item.sender === "You" ? "text-[#D5E8DA]" : "text-[#89948D]"}`}>{item.timestamp}</Text></View>} ListEmptyComponent={<View className="flex-1 items-center justify-center"><MaterialIcons name="forum" size={40} color="#9AA49D" /><Text className="text-[#6D7C73] mt-3">Start the conversation.</Text></View>} /><View className="flex-row items-end gap-2 border-t border-[#E5DED1] pt-3 pb-2"><TextInput value={draft} onChangeText={setDraft} placeholder="Write a pickup note..." placeholderTextColor="#98A29C" multiline className="flex-1 min-h-[48px] max-h-[104px] rounded-2xl bg-[#FFFCF7] border border-[#E5DED1] px-4 py-3 text-[15px] text-[#1F2924]" /><Pressable onPress={submit} className="h-12 w-12 rounded-full bg-[#2F6B4F] items-center justify-center"><MaterialIcons name="send" size={21} color="#FFFCF7" /></Pressable></View></ScreenContainer>;
}
