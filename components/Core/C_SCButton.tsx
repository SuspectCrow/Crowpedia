import React, { useRef } from "react";
import { Text, Pressable, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { AppTheme } from "@/theme";

export enum ButtonVariant {
  SMALL = "small",
  DEFAULT = "default",
  MEDIUM = "medium",
  LARGE = "large",
  ICON_ONLY = "icon_only",
}

export type IconName = keyof typeof MaterialIcons.glyphMap;

interface ButtonProps {
  variant?: ButtonVariant;
  text?: string;
  icon?: IconName;
  iconColor?: string;
  iconPosition?: "left" | "right";
  onPress?: () => void;
  className?: string;
  disabled?: boolean;
  transparent?: boolean;
}

interface ButtonStyleConfig {
  containerClass: string;
  textClass: string;
  iconSize: number;
}

const ButtonStyleMap: Record<ButtonVariant, ButtonStyleConfig> = {
  [ButtonVariant.SMALL]: {
    containerClass: "h-8 px-3",
    textClass: `${AppTheme.typography.fontMedium} text-sm`,
    iconSize: 16,
  },
  [ButtonVariant.DEFAULT]: {
    containerClass: "h-10 px-4",
    textClass: `${AppTheme.typography.fontMedium} text-base`,
    iconSize: 20,
  },
  [ButtonVariant.MEDIUM]: {
    containerClass: "h-12 px-6",
    textClass: `${AppTheme.typography.fontMedium} text-md`,
    iconSize: 24,
  },
  [ButtonVariant.LARGE]: {
    containerClass: "h-14 px-8",
    textClass: `${AppTheme.typography.fontLight} text-lg`,
    iconSize: 28,
  },
  [ButtonVariant.ICON_ONLY]: {
    containerClass: "h-10 w-10 justify-center items-center p-0",
    textClass: "hidden",
    iconSize: 24,
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const SCButton: React.FC<ButtonProps> = ({
  variant = ButtonVariant.DEFAULT,
  text,
  icon,
  iconColor,
  iconPosition = "left",
  onPress,
  className,
  disabled,
  transparent = false,
}) => {
  const styles = ButtonStyleMap[variant];
  const isIconOnly = variant === ButtonVariant.ICON_ONLY;
  const showText = text && !isIconOnly;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  if (iconColor == undefined || iconColor == "" || iconColor == null) {
    iconColor = "#fff";
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      android_ripple={{ color: "transparent", borderless: false }}
      style={{
        transform: [{ scale: scaleAnim }],
      }}
      className={clsx(
        "flex-row items-center justify-center self-start",
        AppTheme.layout.radius,
        AppTheme.layout.margin,
        styles.containerClass,

        transparent
          ? "bg-transparent border-0"
          : clsx(AppTheme.colors.background, AppTheme.colors.border, AppTheme.layout.borderWidth),

        icon && showText && "gap-2",

        "active:opacity-80",

        disabled && "opacity-50",

        className,
      )}
    >
      {icon && iconPosition === "left" && !isIconOnly && (
        <MaterialIcons name={icon} size={styles.iconSize} color={iconColor} />
      )}

      {showText && <Text className={clsx(AppTheme.colors.text, styles.textClass)}>{text}</Text>}

      {icon && iconPosition === "right" && !isIconOnly && (
        <MaterialIcons name={icon} size={styles.iconSize} color={iconColor} />
      )}

      {isIconOnly && icon && <MaterialIcons name={icon} size={styles.iconSize} color={iconColor} />}
    </AnimatedPressable>
  );
};
