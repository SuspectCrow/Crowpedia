import React, { useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView, LayoutAnimation, Platform, UIManager } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface TreeItem {
  id: string;
  name: string;
  children?: TreeItem[];
}

interface TreeViewProps {
  data: TreeItem[];
  selectedId?: string;
  onSelect: (item: TreeItem) => void;
}

const ROW_HEIGHT = 40;
const INDENT = 24;

const TreeNode: React.FC<{
  item: TreeItem;
  level: number;
  selectedId?: string;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (item: TreeItem) => void;
}> = ({ item, level, selectedId, expandedIds, onToggle, onSelect }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedIds.has(item.id);
  const isSelected = selectedId === item.id;

  const iconColor = isSelected ? "white" : "#9ca3af";

  return (
    <View>
      <Pressable
        onPress={() => {
          onSelect(item);
          if (hasChildren) onToggle(item.id);
        }}
        style={{
          height: ROW_HEIGHT,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: level * INDENT + 8,
        }}
        className={clsx(isSelected ? "bg-white/10 rounded-md" : "active:bg-black/20 rounded-md")}
      >
        <View className="w-6 items-center justify-center mr-1">
          {hasChildren && (
            <MaterialIcons name={isExpanded ? "expand-more" : "chevron-right"} size={20} color={iconColor} />
          )}
        </View>

        <MaterialIcons
          name={isExpanded ? "folder-open" : "folder"}
          size={20}
          color={iconColor}
          style={{ marginRight: 8 }}
        />

        <Text className={clsx("font-dmsans text-base", isSelected ? "text-white font-medium" : "text-[#9ca3af]")}>
          {item.name}
        </Text>
      </Pressable>

      {hasChildren && isExpanded && (
        <View>
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export const SCTreeView: React.FC<TreeViewProps> = ({ data, selectedId, onSelect }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["home", "personal"]));

  const toggleFolder = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <ScrollView className="flex-1 bg-[#171717] p-2 rounded-xl border border-[#262626]">
      {data.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          level={0}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onToggle={toggleFolder}
          onSelect={onSelect}
        />
      ))}
    </ScrollView>
  );
};
