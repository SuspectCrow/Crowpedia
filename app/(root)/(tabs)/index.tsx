import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import colors from "tailwindcss/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCNavbar } from "@/components/Partials/C_SCNavbar";
import { router, useLocalSearchParams } from "expo-router";
import { useCardsData } from "@/hooks/useCardsData";
import { useFolderNavigation } from "@/hooks/useFolderNavigation";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { getCardIcon } from "@/interfaces/ICard";
import SCQuickActionsMenu from "@/components/Partials/C_SCQuickActionsMenu";

export default function Index() {
  const params = useLocalSearchParams<{ query?: string; filter?: string; folderId?: string }>();

  const { dataCards, filteredCards, loadingCards, selectedFilters, setSelectedFilters, filterOptions } = useCardsData(
    params.query,
    params.folderId,
  );

  const { folderPaths, handleCardPress, handleBack, activeFolderName } = useFolderNavigation(dataCards!);

  return (
    <View className="flex-1 h-full" style={{ backgroundColor: colors.neutral["950"] }}>
      <SafeAreaView className="h-full relative" edges={["top", "bottom", "left", "right"]}>
        <SCNavbar
          variant={"root"}
          rightAction={{
            icon: "settings",
            onPress: () => console.log("Settings"),
          }}
          className="absolute z-[100]"
        />

        {loadingCards && (
          <View className="absolute top-0 w-full px-1 flex-row justify-center items-center gap-3 h-full z-30 bg-neutral-950">
            <ActivityIndicator size="small" color={colors.neutral["600"]} />
            <Text className="text-neutral-600 font-dmsans-medium text-center text-xl">Loading</Text>
          </View>
        )}

        {filteredCards.length === 0 && !loadingCards && (
          <View className="absolute top-0 w-full px-1 flex-col justify-center h-full items-center">
            <Text className="text-neutral-600 font-dmsans-medium text-center text-md px-24">
              It appears you don't have a card. Try creating a new one.
            </Text>
          </View>
        )}

        <SCQuickActionsMenu options={filterOptions} />

        <ScrollView className="relative"></ScrollView>
      </SafeAreaView>
    </View>
  );
}
