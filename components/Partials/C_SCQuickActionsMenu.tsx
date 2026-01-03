import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { router } from "expo-router";
import { TagOption } from "@/components/Core/C_SCTagSelector";
import clsx from "clsx";

interface TagSelectorProps {
  options: any[];
  className?: string;
}

const SCQuickActionsMenu: React.FC<TagSelectorProps> = ({ options, className }) => {
  const [quickActionsVisibility, setQuickActionsVisibility] = useState(false);

  return (
    <View className={clsx("absolute bottom-36 right-5 z-50", className)}>
      {quickActionsVisibility && (
        <View
          className="bg-neutral-900 border border-neutral-800 rounded-2xl pt-3"
          style={{ width: 112, flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}
        >
          {options.map((item) => (
            <SCButton
              key={item.key}
              variant={ButtonVariant.ICON_ONLY_MEDIUM}
              icon={item.icon}
              className="mx-1"
              onPress={() => {
                router.push(`/card/create/${item.key}`);
              }}
            />
          ))}
        </View>
      )}
      <SCButton
        variant={ButtonVariant.ICON_ONLY_LARGE}
        icon={!quickActionsVisibility ? "add" : "close"}
        onPress={() => {
          setQuickActionsVisibility(!quickActionsVisibility);
        }}
        className="ms-auto"
      />
    </View>
  );
};
export default SCQuickActionsMenu;
