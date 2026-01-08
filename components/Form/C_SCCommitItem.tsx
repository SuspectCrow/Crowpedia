import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { SCInput } from "@/components/Core/C_SCInput";
import colors from "tailwindcss/colors";

export interface CommitItemData {
  id: string;
  title: string;
  date: Date;
  icon?: string | keyof typeof MaterialIcons.glyphMap;
}

interface SCCommitItemProps {
  data: CommitItemData;
  isLast?: boolean;
  isEditing?: boolean;
  onEditStart?: () => void;
  onUpdate?: (id: string, newText: string) => void;
  onUpdateIcon?: (id: string, newIcon: keyof typeof MaterialIcons.glyphMap) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const STATIC_ICONS: (keyof typeof MaterialIcons.glyphMap)[] = [
  "commit",
  "check",
  "bug-report",
  "lock",
  "star",
  "warning",
  "schedule",
  "build",
  "delete",
  "add",
  "verified",
];

export const SCCommitItem: React.FC<SCCommitItemProps> = ({
  data,
  isLast = false,
  isEditing = false,
  onEditStart,
  onUpdate,
  onUpdateIcon,
  onDelete,
  className,
}) => {
  const [tempText, setTempText] = useState(data.title);
  const [showIconSelector, setShowIconSelector] = useState(false);

  useEffect(() => {
    setTempText(data.title);
    if (!isEditing) {
      setShowIconSelector(false);
    }
  }, [isEditing, data.title]);

  const handleTextChange = (text: string) => {
    setTempText(text);
    // Yeni commit için gerçek zamanlı güncelleme
    if (data.id === "new" && onUpdate) {
      onUpdate(data.id, text);
    }
  };

  const handleSubmit = () => {
    if (tempText.trim() === "") {
      onDelete?.(data.id);
    } else {
      onUpdate?.(data.id, tempText);
    }
    Keyboard.dismiss();
  };

  const handleIconSelect = (iconName: keyof typeof MaterialIcons.glyphMap) => {
    onUpdateIcon?.(data.id, iconName);
    setShowIconSelector(false);
  };

  const formattedDate = useMemo(() => {
    const dateStr = data.date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = data.date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${dateStr} • ${timeStr}`;
  }, [data.date]);

  return (
    <View className={clsx("flex-row min-h-[80px] mt-2", className)}>
      <View className="w-16 flex-col justify-start items-center relative">
        {!isLast && <View className="absolute top-4 bottom-[-20px] w-[2px] bg-[#3f3f46]" />}

        <TouchableOpacity
          disabled={!isEditing}
          onPress={() => setShowIconSelector(!showIconSelector)}
          activeOpacity={0.8}
          className={clsx(
            "w-6 h-6 rounded-full items-center justify-center bg-neutral-950 z-20 mt-1",
            !data.icon && !isEditing && "border-2 border-neutral-600",
            isEditing && "bg-neutral-800",
          )}
        >
          {data.icon ? (
            <View className={clsx("w-8 h-8 flex items-center justify-center bg-neutral-950")}>
              <MaterialIcons
                name={data.icon as keyof typeof MaterialIcons.glyphMap}
                size={isEditing ? 24 : 20}
                color={isEditing ? colors.neutral["100"] : colors.neutral["500"]}
              />
            </View>
          ) : (
            isEditing && (
              <View className="border-2 border-neutral-600 rounded-full w-10 h-10 flex items-center justify-center bg-neutral-950">
                <MaterialIcons name="edit" size={18} color={colors.neutral["100"]} />
              </View>
            )
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-1 pb-8 pr-4">
        {isEditing ? (
          <View>
            <SCInput
              value={tempText}
              onChangeText={handleTextChange}
              onSubmitEditing={handleSubmit}
              placeholder={data.id != "new" ? "Clear all to delete..." : "New commit message..."}
              placeholderTextColor="#52525b"
              returnKeyType="done"
              autoHeight
              className="p-1.5"
            />
            <Text className="text-neutral-600 text-xs font-dmsans mt-2 mb-2">{formattedDate}</Text>

            {showIconSelector && (
              <View className="mt-2 bg-neutral-900 border border-neutral-800 rounded-xl p-2 flex-row flex-wrap justify-center gap-2">
                {STATIC_ICONS.map((iconName) => (
                  <TouchableOpacity
                    key={iconName}
                    onPress={() => handleIconSelect(iconName)}
                    className={clsx(
                      "w-10 h-10 items-center justify-center rounded-xl border",
                      data.icon === iconName ? "bg-white/10 border-white/30" : "bg-black/40 border-[#3f3f46]",
                    )}
                  >
                    <MaterialIcons name={iconName} size={18} color={data.icon === iconName ? "white" : "#9ca3af"} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <TouchableOpacity onLongPress={onEditStart} activeOpacity={0.7}>
            <Text className="text-gray-300 text-lg font-dmsans mb-1 leading-6">{data.title}</Text>
            <Text className="text-neutral-600 text-xs font-dmsans">{formattedDate}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
