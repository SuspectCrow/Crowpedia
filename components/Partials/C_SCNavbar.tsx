import React, { useState, useEffect } from "react";
import { View, Text, Platform, BackHandler } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import clsx from "clsx";
import { ButtonVariant, IconName, SCButton } from "@/components/Core/C_SCButton";
import colors from "tailwindcss/colors";

export type NavbarVariant = "root" | "breadcrumb" | "simple" | "center" | "action";

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
  rightAction?: NavbarAction | NavbarAction[];
  className?: string;
}

const NavBreadcrumbs: React.FC<{ breadcrumbs: string[]; rootIcon?: IconName }> = ({
  breadcrumbs,
  rootIcon = "home",
}) => (
  <View className="flex-row items-center flex-wrap flex-1 ml-2">
    <MaterialIcons name={rootIcon} size={18} color="#9ca3af" />
    {breadcrumbs.map((path, index) => {
      const isLast = index === breadcrumbs.length - 1;
      return (
        <View key={index} className="flex-row items-center">
          <MaterialIcons name="chevron-right" size={20} color="#52525b" />
          <Text className={clsx("font-dmsans text-base", isLast ? "text-white font-medium" : "text-[#9ca3af]")}>
            {path}
          </Text>
        </View>
      );
    })}
  </View>
);

const NavTitle: React.FC<{
  title?: string;
  icon?: IconName;
  centered?: boolean;
  variant?: NavbarVariant;
}> = ({ title, icon, centered = false, variant }) => (
  <View className={clsx("flex-row items-center gap-2", centered && "justify-center")}>
    {(icon || (variant === "root" && !icon)) && (
      <MaterialIcons name={icon || "home"} size={20} color={centered ? "white" : "#9ca3af"} />
    )}
    <Text
      className={clsx(
        "font-dmsans text-white",
        centered ? "text-lg font-medium" : variant === "root" ? "text-md text-neutral-300" : "text-lg",
      )}
      numberOfLines={1}
    >
      {(title && title.length > 24 ? title.slice(0, 24) + "..." : title) || (variant === "root" ? "Home" : "")}
    </Text>
  </View>
);

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
  useEffect(() => {
    if (!showBackButton || !onBackPress) return;

    const backAction = () => {
      onBackPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [showBackButton, onBackPress]);

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
      <View className="flex-row items-center gap-3 flex-1 ms-2">
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
            variant === "root" && <NavTitle title={title} icon={icon} variant={variant} />
          )}

          {variant === "breadcrumb" && <NavBreadcrumbs breadcrumbs={breadcrumbs} rootIcon={icon} />}
          {variant === "simple" && <NavTitle title={title} icon={icon} variant={variant} />}
        </View>

        {variant === "center" && (
          <View className="absolute left-0 right-0 items-center pointer-events-none">
            <NavTitle title={title} icon={icon} centered variant={variant} />
          </View>
        )}

        <View className="flex-row justify-end min-w-[40px] gap-2">
          {rightAction &&
            (Array.isArray(rightAction) ? rightAction : [rightAction]).map((action, index) => (
              <SCButton
                key={index}
                icon={action.icon}
                text={action.text}
                onPress={action.onPress}
                variant={ButtonVariant.SMALL}
                transparent={!action.text && !action.icon}
                className={clsx("bg-[#262626] border-0 h-9", !action.text && "px-0 justify-center items-center")}
              />
            ))}
        </View>
      </View>
    </BlurView>
  );
};
