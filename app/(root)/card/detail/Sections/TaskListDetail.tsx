import {View, Text, TouchableOpacity, Alert, FlatList, TextInput} from 'react-native'
import React, {useRef, useState} from 'react'
import {ICard} from "@/interfaces/ICard";
import {updateCard} from "@/lib/appwrite";
import colors from "tailwindcss/colors";
import { MaterialIcons } from "@expo/vector-icons";
import {BackgroundSelector, BackgroundSelectorRef} from "@/components/C_CardBackgroundSelector";

const TaskListDetail = ({ card, onRefresh }: { card: ICard, onRefresh: () => void }) => {
    const [taskList, setTaskList] = useState(() => {
        const parsed = JSON.parse(card.content);
        return parsed.map((item: any, idx: number) => ({
            ...item,
            id: item.id || `legacy-${idx}-${Date.now()}`
        }));
    });
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(card.title);
    const [isSaving, setIsSaving] = useState(false);

    const backgroundSelectorRef = useRef<BackgroundSelectorRef>(null);

    const handlePress = async (index: number) => {
        try {
            const updatedList = [...taskList];
            updatedList[index].Value = !updatedList[index].Value;
            await updateCard(card.$id, { content: JSON.stringify(updatedList, null, 2) });
            card.content = JSON.stringify(updatedList, null, 2);
            setTaskList(updatedList);
            onRefresh();
        } catch (error) {
            console.error("Kaydetme hatası:", error);
        }
    };

    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) {
            Alert.alert("Uyarı", "Lütfen bir görev başlığı girin.");
            return;
        }

        setIsAdding(true);
        try {
            const newTask = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                Title: newTaskTitle.trim(),
                Value: false
            };

            const updatedList = [...taskList, newTask];
            await updateCard(card.$id, { content: JSON.stringify(updatedList, null, 2) });
            card.content = JSON.stringify(updatedList, null, 2);
            setTaskList(updatedList);

            setNewTaskTitle('');
            onRefresh();
        } catch (error) {
            console.error("Ekleme hatası:", error);
            Alert.alert("Hata", "Görev eklenirken bir sorun oluştu.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleEditTitle = (id: string, currentTitle: string) => {
        setEditingId(id);
        setEditingTitle(currentTitle);
    };

    const handleSaveItem = async (id: string) => {
        const item = taskList.find((task: any) => task.id === id);
        if (!item) return;

        if (!editingTitle.trim()) {
            try {
                const updatedList = taskList.filter((task: any) => task.id !== id);
                await updateCard(card.$id, { content: JSON.stringify(updatedList, null, 2) });
                card.content = JSON.stringify(updatedList, null, 2);
                setTaskList(updatedList);
                setEditingId(null);
                setEditingTitle('');
                onRefresh();
            } catch (error) {
                console.error("Silme hatası:", error);
                Alert.alert("Hata", "Görev silinirken bir sorun oluştu.");
            }
            return;
        }

        try {
            const updatedList = taskList.map((task: any) =>
                task.id === id ? { ...task, Title: editingTitle.trim() } : task
            );
            await updateCard(card.$id, { content: JSON.stringify(updatedList, null, 2) });
            card.content = JSON.stringify(updatedList, null, 2);
            setTaskList(updatedList);
            setEditingId(null);
            setEditingTitle('');
            onRefresh();
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            Alert.alert("Hata", "Görev güncellenirken bir sorun oluştu.");
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateCard(card.$id, {
                title: title
            });

            card.title = title;

            await backgroundSelectorRef.current?.save();

            onRefresh();
            setIsEditing(false);
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            Alert.alert("Hata", "Hedef güncellenirken bir sorun oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View className="flex-1">
            {
                isEditing ? (
                    <View>
                        <View>
                            <View className="mb-4">
                                <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Title</Text>
                                <TextInput
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="Başlık Girin"
                                    placeholderTextColor={colors.stone['600']}
                                    className="w-full text-stone-400 font-dmsans-bold text-xl p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                                />
                            </View>

                            <BackgroundSelector ref={backgroundSelectorRef} card={card} />
                        </View>
                        <View className="flex-row items-center justify-items-stretch gap-4 mt-4">
                            <TouchableOpacity onPress={() => { setIsEditing(false) }} className="flex-1 flex-row gap-2 bg-red-600 p-3 rounded-xl border-solid border-red-800/50 border-4 items-center justify-center">
                                <MaterialIcons name={"cancel"} size={18} style={{ color: 'white' }} />
                                <Text className="font-dmsans-bold text-xl text-stone-300 text-center">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { handleSave() }} className="flex-1 flex-row gap-2 bg-green-700 p-3 rounded-xl border-solid border-green-800/50 border-4 items-center justify-center">
                                <MaterialIcons name={"save"} size={18} style={{ color: 'white' }} />
                                <Text className="font-dmsans-bold text-xl text-stone-300 text-center">Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View className="flex-1">
                        <TouchableOpacity onPress={() => { setIsEditing(!isEditing) }} className="flex-row gap-2 bg-green-700 p-3 rounded-xl border-solid border-green-800/50 border-4 items-center justify-center">
                            <MaterialIcons name={"edit"} size={18} style={{ color: 'white' }} />
                            <Text className="font-dmsans-bold text-xl text-stone-300 text-center">Edit</Text>
                        </TouchableOpacity>

                        <FlatList
                            data={taskList}
                            renderItem={({ item }) => (
                                <View className="flex-row items-center gap-2">
                                    <TouchableOpacity onPress={() => {
                                        const index = taskList.findIndex((task: any) => task.id === item.id);
                                        if (index !== -1) handlePress(index);
                                    }}>
                                        <MaterialIcons name={item.Value ? "check" : "check-box-outline-blank"} size={24} style={[{ color: `${item.Value ? colors.stone['500'] : colors.stone['100'] }` }]} />
                                    </TouchableOpacity>
                                    {editingId === item.id ? (
                                        <TextInput
                                            className="flex-1 bg-stone-800 text-stone-200 px-2 py-1 rounded border-solid border-stone-600 border-2 font-dmsans-regular text-base"
                                            value={editingTitle}
                                            onChangeText={setEditingTitle}
                                            onBlur={() => handleSaveItem(item.id)}
                                            onSubmitEditing={() => handleSaveItem(item.id)}
                                            autoFocus
                                            placeholderTextColor={colors.stone[500]}
                                            placeholder="Boş bırakıp enter = sil"
                                        />
                                    ) : (
                                        <TouchableOpacity className="flex-1" onPress={() => handleEditTitle(item.id, item.Title)}>
                                            <Text className={`text-lg ${ item.Value ? 'text-stone-500 line-through' : 'text-stone-300' }`}>{ item.Title }</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            style={[{
                                backgroundColor: '#1c1917',
                                borderRadius: 12,
                                marginHorizontal: 6,
                                marginTop: 24,
                                paddingHorizontal: 6,
                                paddingVertical: 6,
                                borderColor: '#0c0a09',
                                borderWidth: 4,
                            }]}
                            contentContainerStyle={[{
                                display: 'flex',
                                gap: 6,
                                padding: 12
                            }]}
                        />

                        <View className="mx-6 mb-6 mt-4">
                            <View className="flex-row gap-2">
                                <TextInput
                                    className="flex-1 bg-stone-800 text-stone-200 p-4 rounded-xl border-solid border-stone-700/50 border-4 font-dmsans-regular text-base"
                                    placeholder="Yeni görev ekle..."
                                    placeholderTextColor={colors.stone[500]}
                                    value={newTaskTitle}
                                    onChangeText={setNewTaskTitle}
                                    onSubmitEditing={handleAddTask}
                                    editable={!isAdding}
                                    blurOnSubmit={false}
                                />
                                <TouchableOpacity
                                    className="bg-green-700 p-4 rounded-xl border-solid border-green-800/50 border-4 items-center justify-center"
                                    onPress={handleAddTask}
                                    disabled={isAdding}
                                >
                                    <MaterialIcons name={"add"} size={24} style={[{ color: 'white' }]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
            }
        </View>
    );
};
export default TaskListDetail
