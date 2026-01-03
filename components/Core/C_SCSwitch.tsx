import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import colors from "tailwindcss/colors";

export type IconName = keyof typeof MaterialIcons.glyphMap;

interface SwitchProps {
  label?: string;
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  icon?: IconName;
  labelPosition?: "left" | "right";
  className?: string;
  disabled?: boolean;
}

export const SCSwitch: React.FC<SwitchProps> = ({
  label,
  value,
  onValueChange,
  icon,
  labelPosition = "left",
  className,
  disabled,
}) => {
  const animValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const trackColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.neutral["900"], colors.neutral["900"]],
  });

  const borderColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.neutral["800"], colors.neutral["600"]],
  });

  const thumbTranslate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const thumbColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.neutral["800"], colors.neutral["500"]],
  });

  const renderLabel = () => (
    <View className="flex-row items-center">
      {icon && <MaterialIcons name={icon} size={20} color="white" style={{ marginRight: 6 }} />}
      {label && <Text className="text-white font-dmsans text-base font-medium">{label}</Text>}
    </View>
  );

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      className={clsx("flex-row items-center justify-between", disabled && "opacity-50", className)}
    >
      {labelPosition === "left" && <View className="mr-4">{renderLabel()}</View>}

      <Animated.View
        style={{
          backgroundColor: trackColor,
          borderColor: borderColor,
        }}
        className="w-12 h-7 rounded-full justify-center border"
      >
        <Animated.View
          style={{
            transform: [{ translateX: thumbTranslate }],
            backgroundColor: thumbColor,
          }}
          className="w-5 h-5 rounded-full shadow-sm"
        />
      </Animated.View>

      {labelPosition === "right" && <View className="ml-4">{renderLabel()}</View>}
    </Pressable>
  );
};
