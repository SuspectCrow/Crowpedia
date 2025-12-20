import React, {useEffect, useState} from 'react';
import {Modal, ScrollView, Text, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import {getCards} from "@/lib/appwrite";
import {ICard} from "@/interfaces/ICard";
import colors from "tailwindcss/colors";

interface FolderSelectorProps {
    selectedFolderId: string | null;
    onSelect: (folderId: string | null, folderName: string) => void;
}

interface IFolderItem extends ICard {
    level: number;
}

export const FolderSelector = ({ selectedFolderId, onSelect }: FolderSelectorProps) => {
    const [folders, setFolders] = useState<IFolderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedFolderName, setSelectedFolderName] = useState("Ana Dizin (Klasörsüz)");

    useEffect(() => {
        loadFolders();
    }, []);

    const loadFolders = async () => {
        setLoading(true);
        try {
            const docs = await getCards({ filter: "Folder", query: "", limit: 100 });
            const allFolders = docs.map(doc => doc as unknown as ICard);
            const organized = organizeFolders(allFolders);
            setFolders(organized);

            if (selectedFolderId) {
                const selected = allFolders.find(f => f.$id === selectedFolderId);
                if (selected) setSelectedFolderName(selected.title);
            }
        } catch (error) {
            console.error("Klasörler yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    const organizeFolders = (
        allFolders: ICard[],
        parentId: string | null = null,
        level: number = 0
    ): IFolderItem[] => {
        const result: IFolderItem[] = [];

        const children = allFolders.filter(folder => {
            const pId = typeof folder.parentFolder === 'object' && folder.parentFolder
                ? (folder.parentFolder as any).$id
                : folder.parentFolder;

            return pId === parentId || (parentId === null && !pId);
        });

        children.forEach(child => {
            result.push({ ...child, level });
            const grandChildren = organizeFolders(allFolders, child.$id, level + 1);
            result.push(...grandChildren);
        });

        return result;
    };

    const handleSelect = (id: string | null, name: string) => {
        setSelectedFolderName(name);
        onSelect(id, name);
        setShowModal(false);
    };

    return (
        <View>
            <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Konum (Klasör)</Text>

            <TouchableOpacity
                onPress={() => setShowModal(true)}
                className="flex-row items-center justify-between bg-stone-900/50 p-4 rounded-xl border-4 border-stone-700/50"
            >
                <View className="flex-row items-center gap-3 flex-1">
                    <MaterialIcons
                        name={selectedFolderId ? "folder" : "folder-open"}
                        size={24}
                        color={colors.amber[500]}
                    />
                    <Text className="text-stone-300 font-dmsans-bold text-lg" numberOfLines={1}>
                        {selectedFolderName}
                    </Text>
                </View>
                <MaterialIcons name="arrow-drop-down" size={24} color={colors.stone[400]} />
            </TouchableOpacity>

            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
            >
                <View className="flex-1 bg-black/80 justify-end">
                    <View className="bg-stone-900 h-[70%] rounded-t-3xl border-t-4 border-stone-700 overflow-hidden">
                        <View className="p-4 border-b-2 border-stone-800 flex-row justify-between items-center bg-stone-800">
                            <Text className="text-stone-200 font-dmsans-bold text-xl">Klasör Seçin</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)} className="p-2">
                                <MaterialIcons name="close" size={24} color={colors.stone[400]} />
                            </TouchableOpacity>
                        </View>

                        {loading ? (
                            <View className="flex-1 justify-center items-center">
                                <ActivityIndicator size="large" color={colors.amber[500]} />
                            </View>
                        ) : (
                            <ScrollView className="flex-1 p-4">
                                <TouchableOpacity
                                    onPress={() => handleSelect(null, "Ana Dizin (Klasörsüz)")}
                                    className={`flex-row items-center p-4 mb-2 rounded-xl border-2 ${
                                        selectedFolderId === null
                                            ? 'bg-amber-900/20 border-amber-600/50'
                                            : 'bg-stone-800/50 border-stone-700/30'
                                    }`}
                                >
                                    <MaterialIcons name="home" size={24} color={selectedFolderId === null ? colors.amber[500] : colors.stone[400]} />
                                    <Text className={`ml-3 font-dmsans-bold text-lg ${selectedFolderId === null ? 'text-amber-500' : 'text-stone-300'}`}>
                                        Ana Dizin
                                    </Text>
                                </TouchableOpacity>

                                {folders.map((folder) => (
                                    <TouchableOpacity
                                        key={folder.$id}
                                        onPress={() => handleSelect(folder.$id, folder.title)}
                                        style={{ marginLeft: folder.level * 24 }}
                                        className={`flex-row items-center p-3 mb-2 rounded-xl border-l-4 ${
                                            selectedFolderId === folder.$id
                                                ? 'bg-amber-900/20 border-l-amber-500 border-y-0 border-r-0'
                                                : 'bg-stone-800/30 border-l-stone-600 border-y-0 border-r-0'
                                        }`}
                                    >
                                        <MaterialIcons
                                            name="subdirectory-arrow-right"
                                            size={20}
                                            color={colors.stone[600]}
                                            style={{ opacity: folder.level > 0 ? 1 : 0, marginRight: 4 }}
                                        />
                                        <MaterialIcons
                                            name="folder"
                                            size={22}
                                            color={selectedFolderId === folder.$id ? colors.amber[500] : colors.stone[400]}
                                        />
                                        <Text className={`ml-3 font-dmsans-medium text-lg ${selectedFolderId === folder.$id ? 'text-amber-500' : 'text-stone-300'}`}>
                                            {folder.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                                <View className="h-20" />
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};