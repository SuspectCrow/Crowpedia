import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCNavbar } from "@/components/Partials/C_SCNavbar";

const Search = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#292524",
      }}
    >
      <Text className=" font-dmsans-black text-4xl text-red-600">Calendar</Text>
    </SafeAreaView>
  );
};
export default Search;
