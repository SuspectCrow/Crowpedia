import React, { useState } from "react";
import { View, Text, TextInput, Pressable, TextInputProps } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { AppTheme } from "@/theme";

export enum InputVariant {
  SMALL = "small",
  DEFAULT = "default",
  LARGE = "large",
}

export type IconName = keyof typeof MaterialIcons.glyphMap;

interface SCInputProps extends TextInputProps {
  label?: string;
  variant?: InputVariant;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
  containerClassName?: string;
  inputClassName?: string;
  error?: boolean;
  autoHeight?: boolean;
}

interface InputStyleConfig {
  heightClass: string;
  iconSize: number;
  textSize: string;
}

const InputStyleMap: Record<InputVariant, InputStyleConfig> = {
  [InputVariant.SMALL]: {
    heightClass: "h-8 px-3",
    iconSize: 16,
    textSize: "text-sm",
  },
  [InputVariant.DEFAULT]: {
    heightClass: "h-12 px-4",
    iconSize: 20,
    textSize: "text-base",
  },
  [InputVariant.LARGE]: {
    heightClass: "h-14 px-6",
    iconSize: 24,
    textSize: "text-lg",
  },
};

export const SCInput: React.FC<SCInputProps> = ({
  label,
  variant = InputVariant.DEFAULT,
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  containerClassName,
  inputClassName,
  error,
  className,
  autoHeight = false,
  ...props
}) => {
  const styles = InputStyleMap[variant];
  const [isFocused, setIsFocused] = useState(false);

  const renderIcon = (iconName: IconName, onPress?: () => void) => {
    const IconComponent = (
      <MaterialIcons
        name={iconName}
        size={styles.iconSize}
        color={error ? "red" : isFocused ? "white" : "#6b7280"}
        style={{ opacity: 0.8 }}
      />
    );

    if (onPress) {
      return (
        <Pressable onPress={onPress} className="justify-center">
          {IconComponent}
        </Pressable>
      );
    }
    return <View className="justify-center">{IconComponent}</View>;
  };

  return (
    <View className={clsx("w-full mb-4", containerClassName)}>
      {label && <Text className={clsx("mb-2 font-medium", AppTheme.colors.text, styles.textSize)}>{label}</Text>}

      <View
        className={clsx(
          "flex-row w-full",
          autoHeight ? "items-start min-h-12 py-3" : "items-center",
          AppTheme.colors.background,
          AppTheme.layout.borderWidth,
          AppTheme.layout.radius,
          !autoHeight && styles.heightClass,
          error ? "border-red-500" : isFocused ? "border-white" : AppTheme.colors.border,
          className,
        )}
      >
        {leftIcon && <View className="mr-2">{renderIcon(leftIcon, onLeftIconPress)}</View>}

        <TextInput
          {...props}
          placeholderTextColor="#6b7280"
          multiline={autoHeight || props.multiline}
          scrollEnabled={false}
          style={{ flex: 1 }}
          className={clsx(
            AppTheme.colors.text,
            styles.textSize,
            AppTheme.typography.fontMedium,
            "flex-1",
            autoHeight && "py-0",
            inputClassName,
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur && props.onBlur(e);
          }}
        />

        {rightIcon && <View className="ml-2">{renderIcon(rightIcon, onRightIconPress)}</View>}
      </View>
    </View>
  );
};
