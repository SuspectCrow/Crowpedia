import React, { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { ICard, CardVariant, getCardIcon, CardType } from "@/interfaces/ICard";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import colors from "tailwindcss/colors";
import { getHexWithLightness } from "@/helpers/colorsUtils";
import images from "@/constants/commonImages";
import { getCards, getCardsInFolder } from "@/services/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { data } from "browserslist";
import EventCardContent from "@/components/Card/CardContents/EventCardContent";
import DefaultCardContent from "@/components/Card/CardContents/DefaultCardContent";
import TaskListCardContent from "@/components/Card/CardContents/TaskListCardContent";
import FolderCardContent from "@/components/Card/CardContents/FolderCardContent";

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

const renderGradientBackground = (card: ICard, layout: { width: number; height: number }) => {
  return (
    <Canvas style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
      <Rect x={0} y={0} width={layout.width} height={layout.height}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(layout.width, layout.height)}
          colors={[card.background, getHexWithLightness(card.background, 20)]}
        />
      </Rect>
    </Canvas>
  );
};

const CardContent = (card: ICard) => {
  switch (card.type) {
    case CardType.EVENT:
      return <EventCardContent card={card} />;
    case CardType.TASK_LIST:
      return <TaskListCardContent card={card} />;
    case CardType.FOLDER:
      return <FolderCardContent card={card} />;
    default:
      return <DefaultCardContent card={card} />;
  }
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
        "border-4 border-[#0a0a0a5e] rounded-2xl overflow-hidden p-3 min-h-[72px] max-h-[72px]",
        "active:opacity-80",
        className,
      )}
    >
      {renderGradientBackground(card, layout)}

      {CardContent(card)}
    </Pressable>
  );
};

const SCCardLarge: React.FC<CardProps> = ({ card, onPress, onLongPress, className }) => {
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onLayout={(e) => setLayout({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
      className={clsx(
        "border border-neutral-800 rounded-2xl overflow-hidden mx-1 my-1 h-48 max-h-48",
        "active:opacity-80",
        className,
      )}
    >
      {renderGradientBackground(card, layout)}

      {CardContent(card)}
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
        "border border-neutral-800 rounded-2xl overflow-hidden mx-1 my-1 h-72 max-h-72",
        "active:opacity-80",
        className,
      )}
      style={backgroundStyle}
    >
      <Image source={images.largecardgradient} className={`absolute bottom-0 left-0 size-full`} style={{ zIndex: 1 }} />

      {isNetworkUrl(card.background) && (
        <Image source={{ uri: card.background }} className="absolute inset-0 w-full h-full" resizeMode="cover" />
      )}

      {CardContent(card)}
    </Pressable>
  );
};
