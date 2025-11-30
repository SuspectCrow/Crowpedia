import {View, Text, Image, TouchableOpacity, Alert, FlatList, TextInput} from 'react-native'
import React, {useState} from 'react'
import {ICard} from "@/interfaces/ICard";
import {updateCard} from "@/lib/appwrite";
import icons from "@/constants/icons";
import colors from "tailwindcss/colors";

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

    const handleSaveTitle = async (id: string) => {
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

    return (
        <View className="flex-1">
            <FlatList
                data={taskList}
                renderItem={({ item }) => (
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity onPress={() => {
                            const index = taskList.findIndex((task: any) => task.id === item.id);
                            if (index !== -1) handlePress(index);
                        }}>
                            <Image source={item.Value ? icons.check_box : icons.check_box_blank} className={`size-6`} style={[{ tintColor: `${item.Value ? colors.stone['500'] : colors.stone['100'] }` }]}/>
                        </TouchableOpacity>
                        {editingId === item.id ? (
                            <TextInput
                                className="flex-1 bg-stone-800 text-stone-200 px-2 py-1 rounded border-solid border-stone-600 border-2 font-dmsans-regular text-base"
                                value={editingTitle}
                                onChangeText={setEditingTitle}
                                onBlur={() => handleSaveTitle(item.id)}
                                onSubmitEditing={() => handleSaveTitle(item.id)}
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
                        <Image
                            source={icons.add}
                            className="size-6"
                            style={[{ tintColor: '#fff' }]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
export default TaskListDetail
