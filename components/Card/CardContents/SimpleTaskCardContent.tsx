import { Text, View } from "react-native";
import React, { useState } from "react";
import { CardTypeProps, CardVariant, getCardIcon, ICard } from "@/interfaces/ICard";
import clsx from "clsx";
import { MaterialIcons } from "@expo/vector-icons";

const DefaultCardContent: React.FC<CardTypeProps> = ({ ...props }) => {
  const card = props.card as ICard;
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const parsedContent = React.useMemo(() => {
    try {
      return JSON.parse(card.content || "{}");
    } catch {
      return {};
    }
  }, [card.content]);

  switch (card.variant) {
    case CardVariant.SMALL:
      return (
        <View className="flex-row items-start justify-center gap-3">
          <View
            className={`w-9 h-9 ${!parsedContent.value && "rounded-md bg-neutral-950"} flex items-center justify-center`}
          >
            {parsedContent.value && <MaterialIcons name="check" size={32} color="white" />}
          </View>

          <View className="flex-1">
            <Text
              className={clsx(
                "font-dmsans-medium text-base text-white mb-1 z-20",
                card.type === "SimpleTask" && card.content === "true" && "line-through text-neutral-500",
              )}
              numberOfLines={1}
            >
              {card.title}
            </Text>
          </View>
        </View>
      );

    case CardVariant.LARGE:
      return (
        <View className="absolute top-0 bottom-0 left-0 right-0 p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <View
              className={`w-9 h-9 ${!parsedContent.value && "rounded-md bg-neutral-950"} flex items-center justify-center`}
            >
              {parsedContent.value && <MaterialIcons name="check" size={32} color="white" />}
            </View>

            <Text className="font-dmsans-medium text-lg text-white flex-1 z-20" numberOfLines={2}>
              {card.title}
            </Text>
          </View>
          {parsedContent.description && (
            <Text className="font-dmsans-light text-sm text-neutral-300 flex-1 z-20" numberOfLines={4}>
              {parsedContent.description && parsedContent.description.length >= 96
                ? parsedContent.description.slice(0, 96) + "..."
                : parsedContent.description}
            </Text>
          )}
        </View>
      );

    case CardVariant.PORTRAIT:
      return (
        <View className="absolute bottom-0 left-0 right-0 p-4" style={{ zIndex: 2 }}>
          <View className="flex-row items-center gap-2 mb-2">
            <View className="w-10 h-10 bg-[#fafafa33] rounded-xl items-center justify-center">
              <MaterialIcons name={getCardIcon(card.type)} size={24} color="white" />
            </View>
            <Text className="font-dmsans-medium text-lg text-white flex-1 z-20" numberOfLines={2}>
              {card.title}
            </Text>
          </View>
        </View>
      );
  }
};
export default DefaultCardContent;
