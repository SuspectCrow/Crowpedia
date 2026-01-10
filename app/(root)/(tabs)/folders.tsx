import { View, Text, ScrollView, ActivityIndicator, RefreshControl, FlatList } from "react-native";
import React from "react";
import colors from "tailwindcss/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCNavbar } from "@/components/Partials/C_SCNavbar";
import { useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { SCCard } from "@/components/S_SCCard";
import { SCTagSelector } from "@/components/Core/C_SCTagSelector";
import { useCardsData } from "@/hooks/useCardsData";
import { useFolderNavigation } from "@/hooks/useFolderNavigation";
import SCQuickActionsMenu from "@/components/Partials/C_SCQuickActionsMenu";

export default function Folders() {
  const params = useLocalSearchParams<{ query?: string; filter?: string; folderId?: string }>();

  const { dataCards, filteredCards, loadingCards, refetch, selectedFilters, setSelectedFilters, filterOptions } =
    useCardsData(params.query, params.folderId);

  const { folderPaths, handleCardPress, handleCardLongPress, handleBack, activeFolderName } = useFolderNavigation(
    dataCards!,
    "/folders",
  );

  return (
    <View className="flex-1 bg-neutral-950">
      <SafeAreaView className="flex-1 relative" edges={["top", "bottom", "left", "right"]}>
        <SCNavbar
          variant={!params.folderId || params.folderId === "home" ? "root" : "breadcrumb"}
          breadcrumbs={folderPaths}
          title={params.folderId && params.folderId !== "home" ? activeFolderName : "Folders"}
          icon="folder"
          showBackButton={!!params.folderId && params.folderId !== "home"}
          onBackPress={handleBack}
          rightAction={{
            icon: "settings",
            onPress: () => console.log("Settings"),
          }}
          className="absolute z-[100]"
        />

        {loadingCards && !dataCards && (
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

        <ScrollView
          className="relative"
          refreshControl={
            <RefreshControl refreshing={loadingCards} onRefresh={refetch} tintColor={colors.neutral["600"]} />
          }
        >
          <SCTagSelector
            options={[
              { key: "favorites", title: "Favorites", icon: "star", iconColor: `${colors.yellow["500"]}` },
              ...filterOptions,
            ]}
            selectedKeys={selectedFilters}
            onSelect={setSelectedFilters}
            className="absolute top-1 mt-[72px] z-50 px-1"
          />

          {filteredCards.length > 0 && (
            <FlashList
              data={filteredCards}
              numColumns={2}
              masonry
              className="pt-[128px] pb-20"
              renderItem={({ item }) => (
                <SCCard
                  card={item}
                  onPress={() => {
                    handleCardPress(item);
                  }}
                  onLongPress={() => {
                    handleCardLongPress(item);
                  }}
                />
              )}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
