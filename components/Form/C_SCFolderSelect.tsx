import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import colors from "tailwindcss/colors";
import { SCTreeView, TreeItem } from "@/components/Core/C_SCTreeView";
import { getAllFolders } from "@/services/appwrite";
import { buildFolderTree } from "@/helpers/treeUtils";

interface SCFolderSelectProps {
  selectedFolderId?: string;
  onSelect: (folderId: string) => void;
}

export const SCFolderSelect = ({ selectedFolderId, onSelect }: SCFolderSelectProps) => {
  const [folders, setFolders] = useState<TreeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<TreeItem | null>(null);

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      try {
        const folderData = await getAllFolders();
        const tree = buildFolderTree(folderData);
        if (!tree.find((f) => f.id === "home")) {
          tree.unshift({ id: "home", name: "Home" });
        }
        setFolders(tree);
      } catch (error) {
        console.error("Failed to fetch folders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  useEffect(() => {
    if (!selectedFolderId && folders.length > 0) {
      const defaultFolder = folders[0];
      setSelectedFolder(defaultFolder);
      onSelect(defaultFolder.id);
    }
  }, [selectedFolderId, folders, onSelect]);

  if (loading) {
    return (
      <View className="py-4">
        <ActivityIndicator color={colors.neutral["400"]} />
      </View>
    );
  }

  return (
    <View className="bg-neutral-950 border border-neutral-900 rounded-2xl p-3">
      <Text className="text-lg font-dmsans text-neutral-400 text-center mb-4">
        Selected Folder: <Text className="font-dmsans-bold text-neutral-300">{selectedFolder?.name}</Text>
      </Text>
      <SCTreeView
        data={folders}
        selectedId={selectedFolderId}
        onSelect={(item) => {
          onSelect(item.id);
          setSelectedFolder(item);
        }}
      />
    </View>
  );
};
