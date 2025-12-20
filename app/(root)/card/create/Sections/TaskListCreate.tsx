import React, {useRef, useState} from "react";
import {Alert, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {createCard} from "@/lib/appwrite";
import {BackgroundSelector, BackgroundSelectorRef} from "@/components/C_CardBackgroundSelector";
import {FolderSelector} from "@/components/C_FolderSelector";
import colors from "tailwindcss/colors";
import {ICard} from "@/interfaces/ICard";
import {MaterialIcons} from "@expo/vector-icons";
import {router} from "expo-router";

interface TaskListCreateProps {
    onClose: () => void;
    onSuccess?: () => void;
}

interface ITaskItem {
    id: string;
    Title: string;
    Value: boolean;
}

const TaskListCreate = ({ onClose, onSuccess }: TaskListCreateProps) => {
    const [title, setTitle] = useState('');
    const [taskList, setTaskList] = useState<ITaskItem[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const backgroundSelectorRef = useRef<BackgroundSelectorRef>(null);

    const initialCard: ICard = {
        $id: '',
        order: 10,
        title: '',
        content: '',
        type: 'Note',
        background: '#333',
        isLarge: false
    };

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;

        const newItem: ITaskItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            Title: newTaskTitle.trim(),
            Value: false
        };

        setTaskList([...taskList, newItem]);
        setNewTaskTitle('');
    };

    const handleRemoveTask = (id: string) => {
        setTaskList(taskList.filter(item => item.id !== id));
    };

    const handleCreate = async () => {
        if (!title.trim()) {
            Alert.alert("Eksik Bilgi", "Lütfen liste için bir başlık giriniz.");
            return;
        }

        setIsCreating(true);

        try {
            let backgroundData = { background: '#333', isLarge: false };

            if (backgroundSelectorRef.current) {
                backgroundData = backgroundSelectorRef.current.getValues();
            }

            const contentString = JSON.stringify(taskList);

            const newCardData: ICard = {
                title: title,
                type: 'TaskList',
                content: contentString,
                background: backgroundData.background,
                isLarge: backgroundData.isLarge,
                parentFolder: selectedFolderId,
            } as ICard;

            await createCard(newCardData);

            Alert.alert("Başarılı", "Görev listesi oluşturuldu!", [
                {
                    text: "Tamam",
                    onPress: () => {
                        if (onSuccess) onSuccess();
                        else router.replace('/home');
                    }
                }
            ]);

        } catch (error) {
            console.error("Create TaskList Error:", error);
            Alert.alert("Hata", "Liste oluşturulurken bir sorun oluştu.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <View className="flex-1 bg-stone-950">
            <View className="p-4 border-b-4 border-stone-800 bg-stone-900 z-10">
                <Text className="text-stone-200 font-dmsans-bold text-2xl text-center">
                    Yeni Görev Listesi
                </Text>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                <View className="mb-6">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Başlık</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Liste Başlığı..."
                        placeholderTextColor={colors.stone['600']}
                        className="w-full text-stone-300 font-dmsans-bold text-xl p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                <View className="mb-6">
                    <FolderSelector
                        selectedFolderId={selectedFolderId}
                        onSelect={(id) => setSelectedFolderId(id)}
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-1">Görünüm</Text>
                    <BackgroundSelector
                        ref={backgroundSelectorRef}
                        card={initialCard}
                    />
                </View>

                <View className="mb-20">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Görevler</Text>

                    <View className="flex-row gap-2 mb-4">
                        <TextInput
                            className="flex-1 bg-stone-800 text-stone-200 p-3 rounded-xl border-solid border-stone-700/50 border-4 font-dmsans-regular text-base"
                            placeholder="Yeni görev ekle..."
                            placeholderTextColor={colors.stone[500]}
                            value={newTaskTitle}
                            onChangeText={setNewTaskTitle}
                            onSubmitEditing={handleAddTask}
                        />
                        <TouchableOpacity
                            className="bg-stone-700 p-3 rounded-xl border-solid border-stone-600/50 border-4 items-center justify-center"
                            onPress={handleAddTask}
                        >
                            <MaterialIcons name={"add"} size={24} style={[{ color: 'white' }]} />
                        </TouchableOpacity>
                    </View>

                    {taskList.length > 0 ? (
                        <View style={{
                            backgroundColor: '#1c1917',
                            borderRadius: 12,
                            borderColor: '#0c0a09',
                            borderWidth: 4,
                            padding: 8
                        }}>
                            {taskList.map((item, index) => (
                                <View key={item.id} className="flex-row items-center gap-2 p-2 border-b border-stone-800 last:border-0">
                                    <MaterialIcons name="check-box-outline-blank" size={24} color={colors.stone[500]} />
                                    <Text className="flex-1 text-stone-300 font-dmsans-regular text-lg">
                                        {item.Title}
                                    </Text>
                                    <TouchableOpacity onPress={() => handleRemoveTask(item.id)}>
                                        <MaterialIcons name="close" size={20} color={colors.red[400]} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text className="text-stone-600 text-center italic p-4 border-2 border-dashed border-stone-800 rounded-xl">
                            Henüz görev eklenmedi.
                        </Text>
                    )}
                </View>
            </ScrollView>

            <View className="p-4 bg-stone-900 border-t-4 border-stone-800">
                <View className="flex-row gap-4">
                    <TouchableOpacity
                        className="flex-1 bg-stone-700 p-4 rounded-xl border-4 border-stone-700/50"
                        onPress={onClose}
                        disabled={isCreating}
                    >
                        <Text className="text-white font-dmsans-bold text-lg text-center">İptal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`flex-1 p-4 rounded-xl border-4 border-green-800/50 flex-row items-center justify-center gap-2 ${
                            isCreating ? 'bg-green-800' : 'bg-green-700'
                        }`}
                        onPress={handleCreate}
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <Text className="text-white font-dmsans-bold text-lg text-center">Kaydediliyor...</Text>
                        ) : (
                            <>
                                <MaterialIcons name="save" size={24} color="white" />
                                <Text className="text-white font-dmsans-bold text-lg text-center">Kaydet</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default TaskListCreate;