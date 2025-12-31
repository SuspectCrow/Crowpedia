import React from "react";
import { View, Text, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import clsx from "clsx";
import {
  ButtonVariant,
  IconName,
  SCButton,
} from "@/components/Core/C_SCButton";
import colors from "tailwindcss/colors";

export type NavbarVariant =
  | "root"
  | "breadcrumb"
  | "simple"
  | "center"
  | "action";

interface NavbarAction {
  icon?: IconName;
  text?: string;
  onPress: () => void;
}

interface NavbarProps {
  variant?: NavbarVariant;
  title?: string;
  icon?: IconName;
  breadcrumbs?: string[];
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: NavbarAction;
  className?: string;
}

export const SCNavbar: React.FC<NavbarProps> = ({
  variant = "root",
  title,
  icon,
  breadcrumbs = [],
  showBackButton = false,
  onBackPress,
  rightAction,
  className,
}) => {
  const renderBreadcrumbs = () => (
    <View className="flex-row items-center flex-wrap flex-1 ml-2">
      <MaterialIcons name="home" size={18} color="#9ca3af" />
      {breadcrumbs.map((path, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <View key={index} className="flex-row items-center">
            <MaterialIcons name="chevron-right" size={20} color="#52525b" />
            <Text
              className={clsx(
                "font-dmsans text-base",
                isLast ? "text-white font-medium" : "text-[#9ca3af]",
              )}
            >
              {path}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const renderTitle = (centered: boolean = false) => (
    <View
      className={clsx(
        "flex-row items-center gap-2",
        centered && "justify-center",
      )}
    >
      {icon && (
        <MaterialIcons
          name={icon}
          size={20}
          color={centered ? "white" : "#9ca3af"}
        />
      )}
      <Text
        className={clsx(
          "font-dmsans text-lg text-white",
          centered && "font-medium",
        )}
      >
        {title}
      </Text>
    </View>
  );

  return (
    <BlurView
      intensity={Platform.OS === "android" ? 2 : 20}
      tint="dark"
      experimentalBlurMethod="dimezisBlurView"
      className={clsx(
        "w-full h-28 px-4 flex-row items-end pb-3 justify-between",
        "border-b border-white/10",
        className,
      )}
      style={{ backgroundColor: `${colors.neutral["950"]}cc` }}
    >
      <View className="flex-row items-center gap-3 flex-1">
        {showBackButton ? (
          <SCButton
            text="Back"
            icon="chevron-left"
            onPress={onBackPress}
            variant={ButtonVariant.DEFAULT}
            transparent={false}
          />
        ) : (
          variant === "root" && (
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="home" size={20} color="#9ca3af" />
              <Text className="text-[#9ca3af] font-dmsans text-lg">Home</Text>
            </View>
          )
        )}

        {variant === "breadcrumb" && renderBreadcrumbs()}
        {variant === "simple" && renderTitle(false)}
      </View>

      {variant === "center" && (
        <View className="absolute left-0 right-0 items-center pointer-events-none">
          {renderTitle(true)}
        </View>
      )}

      <View className="flex-row justify-end min-w-[40px]">
        {rightAction && (
          <SCButton
            icon={rightAction.icon}
            text={rightAction.text}
            onPress={rightAction.onPress}
            variant={ButtonVariant.SMALL}
            transparent={!rightAction.text && !rightAction.icon ? true : false}
            className={clsx(
              "bg-[#262626] border-0 h-9",
              !rightAction.text && "px-0 justify-center items-center",
            )}
          />
        )}
      </View>
    </BlurView>
  );
};
