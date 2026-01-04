import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { AppTheme } from "@/theme";
import colors from "tailwindcss/colors";

export type IconName = keyof typeof MaterialIcons.glyphMap;

interface CheckBoxProps {
  label?: string;
  checked?: boolean;
  onChange: (newValue: boolean) => void | undefined;
  icon?: IconName;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const SCCheckBox: React.FC<CheckBoxProps> = ({
  label,
  checked,
  onChange,
  icon,
  className,
  disabled,
  children,
}) => {
  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      className={clsx("flex-row items-center self-start", disabled && "opacity-50", className)}
    >
      <View
        className={clsx(
          "h-8 w-8 items-center justify-center mr-3",
          checked ? "bg-transparent" : "bg-neutral-900 rounded-md  border border-neutral-800",
        )}
      >
        {checked && <MaterialIcons name="check" size={24} color="#9ca3af" />}
      </View>

      {(label || icon) && (
        <View className="flex-row items-center">
          {icon && (
            <MaterialIcons
              name={icon}
              size={24}
              color={checked ? colors.neutral["300"].toString() : "white"}
              style={{ marginRight: 6 }}
            />
          )}

          {label && (
            <Text
              className={clsx(
                "text-base font-dmsans font-medium",
                checked ? "text-neutral-500 line-through decoration-neutral-500" : "text-white",
              )}
            >
              {label}
            </Text>
          )}
        </View>
      )}

      {children}
    </Pressable>
  );
};
