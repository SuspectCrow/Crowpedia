import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { SCSelector } from "@/components/Core/C_SCSelector";
import { SCTreeView } from "@/components/Core/C_SCTreeView";

const FolderCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  const [isCardCoreSettingsColapsed, setIsCardCoreSettingsColapsed] = useState(false);

  return (
    <View>
      <View className="bg-neutral-900 border border-neutral-800 rounded-xl mx-3 p-3">
        <Pressable
          className="flex-row justify-between items-center"
          onPress={() => setIsCardCoreSettingsColapsed(!isCardCoreSettingsColapsed)}
        >
          <Text className="text-neutral-300 font-dmsans-semibold text-lg">Apperance and Location</Text>
          <MaterialIcons
            name={isCardCoreSettingsColapsed ? "arrow-upward" : "arrow-downward"}
            size={24}
            color={colors.neutral["300"]}
          />
        </Pressable>
        {isCardCoreSettingsColapsed && (
          <View>
            <Text>Deneme</Text>
          </View>
        )}
      </View>
    </View>
  );
};
export default FolderCreate;
