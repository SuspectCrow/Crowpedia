import { View, Text, Image, ScrollView } from "react-native";
import React, { useEffect } from "react";
import colors from "tailwindcss/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCNavbar } from "@/components/Partials/C_SCNavbar";
import { getCards } from "@/services/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { SCCard } from "@/components/S_SCCard";

export default function Index() {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const {
    data: dataCards,
    refetch: refetchCards,
    loading: loadingCards,
  } = useAppwrite({
    fn: getCards,
    params: {
      limit: 99,
    },
    skip: false,
  });

  useEffect(() => {
    refetchCards({
      limit: 99,
    });
  }, [params.query, params.filter]);

  return (
    <View className="flex-1 h-full" style={{ backgroundColor: colors.neutral["950"] }}>
      <Image
        source={{ uri: "https://i.pinimg.com/736x/2e/32/dc/2e32dcc152177503e7fb6cafac26fe22.jpg" }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />

      <SafeAreaView className="h-full relative" edges={["bottom", "left", "right"]}>
        <SCNavbar
          variant="root"
          rightAction={{
            icon: "settings",
            onPress: () => console.log("Settings"),
          }}
          className="absolute z-50"
        />

        <ScrollView>
          <FlashList
            data={dataCards}
            numColumns={2}
            masonry
            className="pt-[128px]"
            renderItem={({ item, index }) => {
              return <SCCard card={item} />;
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
