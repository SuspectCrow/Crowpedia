import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { SCCheckBox } from "@/components/Core/C_SCCheckBox";
import { SCInput } from "@/components/Core/C_SCInput";
import clsx from "clsx";
import { AppTheme } from "@/theme";

export interface SCTaskInputProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  label: string;
  onLabelChange?: (value: string) => void;
  onTaskDeleted?: () => void;
}

export const SCTaskInput = ({ value, onValueChange, label, onLabelChange, onTaskDeleted }: SCTaskInputProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleValueChange = (newValue: boolean) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const handleSubmitEditing = () => {
    if (!label || label.trim() === "") {
      onTaskDeleted?.();
    } else {
      setIsEditing(false);
    }
  };

  return (
    <View className="flex-row gap-1 items-center justify-start">
      <SCCheckBox checked={value} onChange={handleValueChange} />
      <View className="flex-1">
        {isEditing ? (
          <SCInput value={label} onChangeText={onLabelChange} autoFocus onSubmitEditing={handleSubmitEditing} />
        ) : (
          <Pressable onPress={() => setIsEditing(true)}>
            <Text className={clsx("mb-3 font-dmsans text-lg", AppTheme.colors.text)}>{label ? label : ""}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
