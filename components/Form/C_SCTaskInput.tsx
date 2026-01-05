import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { SCCheckBox } from "@/components/Core/C_SCCheckBox";
import { SCInput } from "@/components/Core/C_SCInput";
import clsx from "clsx";
import { AppTheme } from "@/theme";

export interface SCTaskInputProps {
  id?: string | number;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  label: string;
  isEditingDefault?: boolean;
  onLabelChange?: (value: string) => void;
  onTaskSubmit?: (value: string) => void;
  onTaskDeleted?: () => void;
}

export const SCTaskInput = ({
  id,
  value,
  onValueChange,
  label,
  isEditingDefault,
  onLabelChange,
  onTaskSubmit,
  onTaskDeleted,
}: SCTaskInputProps) => {
  const [isEditing, setIsEditing] = useState(isEditingDefault);

  const handleValueChange = (newValue: boolean) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const handleSubmitEditing = () => {
    if (!label || label.trim() === "") {
      onTaskDeleted?.();
    } else {
      if (onTaskSubmit) {
        onTaskSubmit(label);
      }
      if (!isEditingDefault) {
        setIsEditing(false);
      }
    }
  };

  return (
    <View className="flex-row gap-1 items-center justify-start">
      {!isEditingDefault && <SCCheckBox checked={value} onChange={handleValueChange} />}
      <View className="flex-1">
        {isEditing ? (
          <SCInput
            value={label}
            onChangeText={onLabelChange}
            placeholder={!isEditingDefault ? "Press enter for delete task" : "Enter your task..."}
            autoFocus
            onSubmitEditing={handleSubmitEditing}
            containerClassName="mb-0"
          />
        ) : (
          <Pressable onPress={() => setIsEditing(true)} className="h-12 justify-center">
            <Text className={clsx("font-dmsans text-lg", AppTheme.colors.text)}>{label ? label : ""}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
