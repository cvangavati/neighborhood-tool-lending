import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View, useWindowDimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAppState, type ToolCategory } from "@/lib/app-state";

const categories: ("All" | ToolCategory)[] = ["All", "Power tools", "Garden", "Hand tools", "Cleaning", "Outdoor"];

export default function HomeScreen() {
  const { tools, isWishlisted, toggleWishlist, profile } = useAppState();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const filteredTools = useMemo(() => tools.filter((tool) => {
    const matchesQuery = `${tool.name} ${tool.owner}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || tool.category === category;
    return matchesQuery && matchesCategory;
  }), [tools, query, category]);

  return (
    <ScreenContainer className="px-5" containerClassName="bg-[#F6F1E8]"><View style={{ width: "100%", maxWidth: 820, alignSelf: "center" }}>
      <FlatList
        data={filteredTools}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: isLandscape ? 12 : 18, paddingBottom: 36 }}
        ListHeaderComponent={
          <View>
            <View className="flex-row items-center justify-between mb-7">
              <View>
                <Text className="text-sm font-semibold text-[#6D7C73]">{profile.neighborhood.toUpperCase()}</Text>
                <Text className="text-[34px] leading-[39px] font-bold text-[#1F2924] mt-1">Borrow, don’t buy.</Text>
              </View>
              <Pressable onPress={() => router.push("/add-tool")} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]} className="h-12 w-12 rounded-full bg-[#2F6B4F] items-center justify-center">
                <MaterialIcons name="add" size={26} color="#FFFCF7" />
              </Pressable>
            </View>
            <View className="flex-row items-center bg-[#FFFCF7] border border-[#E5DED1] rounded-2xl px-4 h-14 mb-5">
              <MaterialIcons name="search" size={22} color="#6D7C73" />
              <TextInput value={query} onChangeText={setQuery} placeholder="Search tools or neighbors" placeholderTextColor="#98A29C" className="flex-1 ml-3 text-[16px] text-[#1F2924]" />
            </View>
            <FlatList horizontal showsHorizontalScrollIndicator={false} data={categories} keyExtractor={(item) => item} contentContainerStyle={{ gap: 8, paddingBottom: 24 }} renderItem={({ item }) => (
              <Pressable onPress={() => setCategory(item)} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]} className={`rounded-full px-4 py-2.5 border ${category === item ? "bg-[#2F6B4F] border-[#2F6B4F]" : "bg-transparent border-[#D8D0C2]"}`}>
                <Text className={`text-[13px] font-semibold ${category === item ? "text-[#FFFCF7]" : "text-[#5C6A61]"}`}>{item}</Text>
              </Pressable>
            )} />
            <View className="flex-row items-center justify-between mb-3"><Text className="text-[21px] font-bold text-[#1F2924]">Available nearby</Text><Text className="text-[13px] font-semibold text-[#6D7C73]">{filteredTools.filter((tool) => tool.status === "available").length} tools</Text></View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: "/tool/[id]", params: { id: item.id } })} style={({ pressed }) => [{ opacity: pressed ? 0.82 : 1 }]} className="bg-[#FFFCF7] border border-[#E5DED1] rounded-[22px] p-4 mb-3 flex-row">
            <View style={{ backgroundColor: item.accent }} className="w-[76px] h-[76px] rounded-2xl items-center justify-center"><MaterialIcons name={item.icon as keyof typeof MaterialIcons.glyphMap} size={34} color="#2F6B4F" /></View>
            <View className="flex-1 ml-4 justify-center"><View className="flex-row items-center justify-between"><Text className="text-[17px] font-bold text-[#1F2924] flex-1 mr-2">{item.name}</Text><View className="flex-row items-center gap-2"><Pressable onPress={() => toggleWishlist(item.id)} hitSlop={8}><MaterialIcons name={isWishlisted(item.id) ? "favorite" : "favorite-border"} size={20} color={isWishlisted(item.id) ? "#B84C3A" : "#89948D"} /></Pressable><View className={`rounded-full px-2.5 py-1 ${item.status === "available" ? "bg-[#E3F1E7]" : "bg-[#F5E9D2]"}`}><Text className={`text-[11px] font-bold ${item.status === "available" ? "text-[#31714E]" : "text-[#9A6617]"}`}>{item.status === "available" ? "AVAILABLE" : "BORROWED"}</Text></View></View></View><Text className="text-[13px] text-[#6D7C73] mt-1">{item.owner}  ·  {item.distance}</Text><Text numberOfLines={1} className="text-[13px] text-[#526159] mt-2">{item.description}</Text></View>
          </Pressable>
        )}
        ListEmptyComponent={<View className={`items-center px-6 ${isLandscape ? "py-4" : "py-16"}`}><MaterialIcons name="handyman" size={46} color="#9AA49D" /><Text className="text-lg font-bold text-[#1F2924] mt-4 text-center">Your board is ready for its first tool</Text><Text className="text-sm text-[#6D7C73] mt-1 text-center">List something useful or set up your profile so neighbors know who is sharing.</Text><Pressable onPress={() => router.push("/add-tool")} className="bg-[#2F6B4F] rounded-xl px-5 py-3 mt-5"><Text className="font-bold text-[#FFFCF7]">List a tool</Text></Pressable></View>}
      />
      </View>
    </ScreenContainer>
  );
}
