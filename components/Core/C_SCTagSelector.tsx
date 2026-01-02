import React from "react";
import { ScrollView, View } from "react-native";
import { SCButton, IconName } from "./C_SCButton";
import clsx from "clsx";

export interface TagOption {
  key: string;
  title: string;
  icon?: IconName;
  iconColor?: string;
}

interface TagSelectorProps {
  options: TagOption[];
  selectedKeys: string[];
  onSelect: (keys: string[]) => void;
  className?: string;
}

export const SCTagSelector: React.FC<TagSelectorProps> = ({ options, selectedKeys, onSelect, className }) => {
  const handlePress = (key: string) => {
    if (selectedKeys.includes(key)) {
      onSelect(selectedKeys.filter((k) => k !== key));
    } else {
      onSelect([...selectedKeys, key]);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}
      contentContainerStyle={{ paddingRight: 20, gap: 12 }}
    >
      {options.map((item) => {
        const isSelected = selectedKeys.includes(item.key);

        return (
          <SCButton
            key={item.key}
            text={item.title}
            icon={item.icon}
            iconColor={item.iconColor}
            onPress={() => handlePress(item.key)}
            className={(clsx("h-10 px-5 rounded-lg"), `${isSelected ? "!border-neutral-300" : "!border-neutral-800"}`)}
          />
        );
      })}
    </ScrollView>
  );
};
