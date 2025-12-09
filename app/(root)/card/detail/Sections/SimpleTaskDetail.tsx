import {ICard} from "@/interfaces/ICard";
import {Alert, Image, Linking, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import colors from "tailwindcss/colors";
import {updateCard} from "@/lib/appwrite";
import {MaterialIcons} from "@expo/vector-icons";

const LinkDetail = ({ card, onRefresh }: { card: ICard, onRefresh: () => void }) => {

    const [title, setTitle] = useState(card.title);
    const [content, setContent] = useState(card.content == "true");
    const [isAdding, setIsAdding] = useState(false);

    const handleAddTask = async () => {
        setIsAdding(true);
        try {
            await updateCard(card.$id, {
                content: String(content),
                title: title
            });

            card.content = String(content);
            card.title = title;

            onRefresh();
        } catch (error) {
            console.error("Ekleme hatası:", error);
            Alert.alert("Hata", "Görev güncellenirken bir sorun oluştu.");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <View className="mx-4 mt-4">

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

            <View className="flex-row gap-2 items-center w-fit">
                <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Value</Text>

                <TouchableOpacity onPress={() => setContent(!content)}>
                    <MaterialIcons name={content ? "check" : "check-box-outline-blank"} size={32}/>
                </TouchableOpacity>
            </View>


            <TouchableOpacity
                className="bg-green-700 p-4 rounded-xl border-solid border-green-800/50 border-4 items-center justify-center mt-6"
                onPress={handleAddTask}
                disabled={isAdding}
            >
                {isAdding ? (
                    <Text className="text-white font-dmsans-bold text-xl">Kaydediliyor...</Text>
                ) : (
                    <View className="flex-row items-center gap-2">
                        <MaterialIcons name={"content-save"} className="size-6" style={[{ color: '#fff' }]}/>
                        <Text className="text-white font-dmsans-bold text-xl">Kaydet</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    )
}

export default LinkDetail;