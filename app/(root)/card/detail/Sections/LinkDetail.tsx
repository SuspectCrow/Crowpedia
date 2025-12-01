import {ICard} from "@/interfaces/ICard";
import {Alert, Image, Linking, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import icons from "@/constants/icons";
import colors from "tailwindcss/colors";
import {updateCard} from "@/lib/appwrite";

const LinkDetail = ({ card, onRefresh }: { card: ICard, onRefresh: () => void }) => {

    const [link, setLink] = useState(card.content);
    const [title, setTitle] = useState(card.title);
    const [isAdding, setIsAdding] = useState(false);

    const handleOpenLink = async () => {
        if (!link) return;

        let targetUrl = link.trim();
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }

        try {
            const supported = await Linking.canOpenURL(targetUrl);

            if (supported) {
                await Linking.openURL(targetUrl);
            } else {
                Alert.alert("Hata", `Bu link açılamıyor: ${targetUrl}`);
            }
        } catch (error) {
            Alert.alert("Hata", "Link açılırken bir sorun oluştu.");
        }
    };

    const handleAddTask = async () => {
        setIsAdding(true);
        try {
            await updateCard(card.$id, {
                content: link,
                title: title
            });

            card.content = link;
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

            <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Link</Text>

            <View className="flex-row items-center gap-2">
                <TextInput
                    value={link}
                    onChangeText={setLink}
                    placeholder="https://example.com"
                    placeholderTextColor={colors.stone['600']}
                    keyboardType="url"
                    autoCapitalize="none"
                    className="flex-1 text-stone-400 font-dmsans-bold text-xl p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                />

                <TouchableOpacity
                    onPress={handleOpenLink}
                    className="p-3 bg-stone-600 rounded-xl border-solid border-4 border-stone-700/50 items-center justify-center"
                >
                    <Image
                        source={icons.link}
                        className="size-8"
                        style={{ tintColor: colors.stone['900'] }}
                    />
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
                        <Image
                            source={icons.save /* icons dosyanızda save ikonu yoksa check ikonu da kullanabilirsiniz */}
                            className="size-6"
                            style={[{ tintColor: '#fff' }]}
                        />
                        <Text className="text-white font-dmsans-bold text-xl">Kaydet</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    )
}

export default LinkDetail;