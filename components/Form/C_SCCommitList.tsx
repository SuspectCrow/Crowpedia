import React, { useState } from "react";
import { View, Text, FlatList, Keyboard, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { CommitItemData, SCCommitItem } from "@/components/Form/C_SCCommitItem";

interface SCCommitListProps {
  commits: CommitItemData[];
  onCommitsChange: (commits: CommitItemData[]) => void;
}

export const SCCommitList: React.FC<SCCommitListProps> = ({ commits, onCommitsChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCommitTitle, setNewCommitTitle] = useState<string>("");
  const [newCommitIcon, setNewCommitIcon] = useState<keyof typeof MaterialIcons.glyphMap | "">("");

  const handleUpdateIcon = (id: string, newIcon: keyof typeof MaterialIcons.glyphMap) => {
    onCommitsChange(commits.map((item) => (item.id === id ? { ...item, icon: newIcon } : item)));
  };

  const handleDelete = (id: string) => {
    onCommitsChange(commits.filter((item) => item.id !== id));
    setEditingId(null);
  };

  const handleUpdate = (id: string, newText: string) => {
    onCommitsChange(commits.map((item) => (item.id === id ? { ...item, title: newText } : item)));
    setEditingId(null);
  };

  const handleAddCommit = () => {
    if (!newCommitTitle.trim()) {
      return;
    }

    const newCommit: CommitItemData = {
      id: Date.now().toString(),
      title: newCommitTitle.trim(),
      date: new Date(),
      icon: newCommitIcon || undefined,
    };

    onCommitsChange([...commits, newCommit]);
    setNewCommitTitle("");
    setNewCommitIcon("");
    Keyboard.dismiss();
  };

  const handleNewCommitUpdate = (id: string, newText: string) => {
    setNewCommitTitle(newText);
  };

  const handleNewCommitIconUpdate = (id: string, newIcon: keyof typeof MaterialIcons.glyphMap) => {
    setNewCommitIcon(newIcon);
  };

  return (
    <View className="border-t border-neutral-800 mt-6">
      <View className="flex-row items-center justify-center gap-2 mt-6">
        <MaterialIcons name="commit" size={22} color={colors.neutral["300"]} />
        <Text className="font-dmsans text-lg text-neutral-300">Commits</Text>
      </View>

      <TouchableWithoutFeedback
        onPress={() => {
          setEditingId(null);
          Keyboard.dismiss();
        }}
      >
        <View className="flex-1 px-6 mt-8">
          <FlatList
            data={commits}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item, index }) => (
              <SCCommitItem
                data={item}
                isLast={index === commits.length - 1}
                isEditing={editingId === item.id}
                onEditStart={() => setEditingId(item.id)}
                onUpdate={handleUpdate}
                onUpdateIcon={handleUpdateIcon}
                onDelete={handleDelete}
              />
            )}
          />
        </View>
      </TouchableWithoutFeedback>

      <View className="flex-row items-center justify-center mx-2">
        <View className="flex-1">
          <SCCommitItem
            data={{
              id: "new",
              date: new Date(),
              title: newCommitTitle,
              icon: newCommitIcon,
            }}
            isLast={true}
            isEditing={true}
            onUpdate={handleNewCommitUpdate}
            onUpdateIcon={handleNewCommitIconUpdate}
          />
        </View>
        <SCButton variant={ButtonVariant.ICON_ONLY_MEDIUM} icon="add" onPress={handleAddCommit} />
      </View>
    </View>
  );
};
