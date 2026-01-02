import { View, Text, Image, ScrollView } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import colors from "tailwindcss/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCNavbar } from "@/components/Partials/C_SCNavbar";
import { getCards } from "@/services/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { SCCard } from "@/components/S_SCCard";
import { SCTagSelector, TagOption } from "@/components/Core/C_SCTagSelector";
import { CardType, getCardIcon } from "@/interfaces/ICard";
import { MaterialIcons } from "@expo/vector-icons";

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
    const timer = setTimeout(() => {
      refetchCards({
        limit: 99,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [params.query]);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filteredCards = useMemo(() => {
    if (!dataCards) return [];
    if (selectedFilters.length === 0) return dataCards;

    const isFavoriteSelected = selectedFilters.includes("favorites");
    const otherFilters = selectedFilters.filter((f) => f !== "favorites");

    return dataCards.filter((card) => {
      const matchesFavorite = isFavoriteSelected ? card.isFavorite : false;
      const matchesType = otherFilters.length > 0 ? otherFilters.includes(card.type || "") : false;

      return matchesFavorite || matchesType;
    });
  }, [dataCards, selectedFilters]);

  const filterOptions: TagOption[] = useMemo(() => {
    return Object.values(CardType).map((type) => ({
      key: type,
      title: type,
      icon: getCardIcon(type),
    }));
  }, []);

  return (
    <View className="flex-1 h-full" style={{ backgroundColor: colors.neutral["950"] }}>
      {/*<Image*/}
      {/*  source={{ uri: "https://i.pinimg.com/736x/2e/32/dc/2e32dcc152177503e7fb6cafac26fe22.jpg" }}*/}
      {/*  className="absolute inset-0 w-full h-full"*/}
      {/*  resizeMode="cover"*/}
      {/*/>*/}

      <SafeAreaView className="h-full relative" edges={["bottom", "left", "right"]}>
        <SCNavbar
          variant="root"
          rightAction={{
            icon: "settings",
            onPress: () => console.log("Settings"),
          }}
          className="absolute z-50"
        />

        {filteredCards.length == 0 && (
          <View className="absolute top-0 w-full px-1 flex-col justify-center h-full items-center">
            <Text className="text-neutral-600 font-dmsans-medium text-center text-md px-24">
              It appears you don't have a card. Try creating a new one.
            </Text>
          </View>
        )}

        <ScrollView className="relative">
          <SCTagSelector
            options={[
              { key: "favorites", title: "Favorites", icon: "star", iconColor: `${colors.yellow["500"]}` },
              ...filterOptions,
            ]}
            selectedKeys={selectedFilters}
            onSelect={setSelectedFilters}
            className="absolute top-1 mt-[100px] z-50 px-1"
          />

          {filteredCards.length > 0 && (
            <FlashList
              data={filteredCards}
              numColumns={2}
              masonry
              className="pt-[156px] pb-16"
              renderItem={({ item, index }) => {
                return <SCCard card={item} />;
              }}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
