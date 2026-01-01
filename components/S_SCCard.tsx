import React, { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { ICard, CardVariant, getCardIcon } from "@/interfaces/ICard";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import colors from "tailwindcss/colors";
import { getHexWithLightness } from "@/helpers/colorsUtils";

export type IconName = keyof typeof MaterialIcons.glyphMap;

interface CardProps {
  card: ICard;
  onPress?: () => void;
  onLongPress?: () => void;
  className?: string;
}

const isNetworkUrl = (urlString: string) => {
  if (!urlString) return false;
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isColorString = (str: string) => {
  return str?.includes("#") || str?.includes("rgb") || str?.includes("rgba");
};

const renderCardIcon = (card: ICard) => {
  switch (card.type) {
    case "SimpleTask":
      return (
        <View
          className={`w-10 h-10 rounded-lg ${card.content === "true" ? "" : "bg-neutral-900 border-2 border-neutral-800"} items-center justify-center`}
        >
          {card.content === "true" && <MaterialIcons name={"check"} size={28} color={colors.neutral["50"]} />}
        </View>
      );
    default:
      return (
        <View className="w-10 h-10 rounded-lg bg-[#fafafa33] rounded-xl items-center justify-center">
          <MaterialIcons name={getCardIcon(card.type)} size={24} color="white" />
        </View>
      );
  }
};

const renderCardContent = (card: ICard) => {
  let contentPreview = "";

  try {
    const parsed = JSON.parse(card.content || "{}");

    if (card.type === "Event") {
      contentPreview = parsed.timestamp;
    } else if (card.type === "Objective") {
      contentPreview = parsed.description || "";
    } else if (card.type === "TaskList" && Array.isArray(parsed)) {
      const incompleteTasks = parsed.filter((t: any) => !t.Value).length;
      contentPreview = `${incompleteTasks} görev kaldı`;
    }
  } catch {
    contentPreview = card.content?.substring(0, 50) || "";
  }

  return contentPreview;
};

export const SCCard: React.FC<CardProps> = ({ ...props }) => {
  switch (props.card.variant) {
    case "small":
      return <SCCardSmall {...props} />;
    case "large":
      return <SCCardLarge {...props} />;
    case "portrait":
      return <SCCardPortrait {...props} />;
    default:
      return <SCCardSmall {...props} />;
  }
};

const SCCardSmall: React.FC<CardProps> = ({ card, onPress, onLongPress, className }) => {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onLayout={(e) => setLayout({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
      className={clsx(
        "border-4 border-[#0a0a0a5e] rounded-2xl overflow-hidden p-4 mx-1 my-1",
        "active:opacity-80",
        className,
      )}
    >
      <Canvas style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        <Rect x={0} y={0} width={layout.width} height={layout.height}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(layout.width, layout.height)}
            colors={[card.background, getHexWithLightness(card.background, 30)]}
          />
        </Rect>
      </Canvas>

      <View className="flex-row items-start gap-3">
        {renderCardIcon(card)}

        <View className="flex-1">
          <Text
            className={clsx(
              "font-dmsans-medium text-base text-white mb-1",
              card.type === "SimpleTask" && card.content === "true" && "line-through text-neutral-500",
            )}
            numberOfLines={1}
          >
            {card.title}
          </Text>

          {renderCardContent(card) && (
            <Text className="text-sm text-neutral-400 font-dmsans" numberOfLines={1}>
              {renderCardContent(card)}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const SCCardLarge: React.FC<CardProps> = ({ card, onPress, onLongPress, className }) => {
  const backgroundStyle = isColorString(card.background) ? { backgroundColor: card.background } : {};

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className={clsx(
        "border border-neutral-800 rounded-2xl overflow-hidden mx-1 my-1 h-72",
        "active:opacity-80",
        className,
      )}
      style={backgroundStyle}
    >
      {isNetworkUrl(card.background) && (
        <Image source={{ uri: card.background }} className="absolute inset-0 w-full h-full" resizeMode="cover" />
      )}

      <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <View className="absolute bottom-0 left-0 right-0 p-4">
        <View className="flex-row items-center gap-2 mb-2">
          {renderCardIcon(card)}
          <Text className="font-dmsans-medium text-lg text-white flex-1" numberOfLines={2}>
            {card.title}
          </Text>
        </View>

        {renderCardContent(card) && (
          <Text className="text-sm text-neutral-300 font-dmsans" numberOfLines={2}>
            {renderCardContent(card)}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const SCCardPortrait: React.FC<CardProps> = ({ card, onPress, onLongPress, className }) => {
  const backgroundStyle = isColorString(card.background) ? { backgroundColor: card.background } : {};

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className={clsx(
        "border border-neutral-800 rounded-2xl overflow-hidden mx-1 my-1 h-72",
        "active:opacity-80",
        className,
      )}
      style={backgroundStyle}
    >
      {isNetworkUrl(card.background) && (
        <Image source={{ uri: card.background }} className="absolute inset-0 w-full h-full" resizeMode="cover" />
      )}

      <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <View className="absolute bottom-0 left-0 right-0 p-4">
        <View className="flex-row items-center gap-2 mb-2">
          {renderCardIcon(card)}
          <Text className="font-dmsans-medium text-lg text-white flex-1" numberOfLines={2}>
            {card.title}
          </Text>
          <MaterialIcons name="check-circle" size={20} color="#22c55e" />
        </View>

        {renderCardContent(card) && (
          <Text className="text-sm text-neutral-300 font-dmsans" numberOfLines={2}>
            {renderCardContent(card)}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const SCCardCollection: React.FC<CardProps> = ({ card, onPress, onLongPress, className }) => {
  const parsedContent = JSON.parse(card.content || "{}");
  const items = parsedContent.items || [];
  const firstItem = items[0];

  const posterUrl = firstItem?.metadata?.poster || firstItem?.metadata?.background;
  const rating = firstItem?.rating || 0;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className={clsx(
        "border border-neutral-800 rounded-2xl overflow-hidden mx-1 my-1 h-72",
        "active:opacity-80",
        className,
      )}
    >
      {posterUrl && <Image source={{ uri: posterUrl }} className="absolute inset-0 w-full h-full" resizeMode="cover" />}

      <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <View className="absolute bottom-0 left-0 right-0 p-4">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 items-center justify-center">
            <MaterialIcons name="movie" size={24} color="white" />
          </View>
          <Text className="font-dmsans-medium text-base text-white flex-1" numberOfLines={2}>
            {card.title}
          </Text>
        </View>

        {rating > 0 && (
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="star" size={16} color="#eab308" />
            <Text className="text-sm text-neutral-300 font-dmsans">{rating}/5</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};
