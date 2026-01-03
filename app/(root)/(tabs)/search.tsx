import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCNavbar } from "@/components/Partials/C_SCNavbar";

const Search = () => {
  return (
    <View className="flex-1 bg-neutral-950">
      <Image
        source={{ uri: "https://i.pinimg.com/736x/2e/32/dc/2e32dcc152177503e7fb6cafac26fe22.jpg" }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />

      <SafeAreaView className="flex-1 relative" edges={["bottom", "left", "right"]}>
        <SCNavbar
          variant="root"
          rightAction={{
            icon: "settings",
            onPress: () => console.log("Settings"),
          }}
        />

        <ScrollView className="pb-20">
          <Text>Search</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default Search;
