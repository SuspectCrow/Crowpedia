import {ICard} from "@/interfaces/ICard";
import {Alert, Linking, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useRef, useState} from "react";
import colors from "tailwindcss/colors";
import {updateCard} from "@/lib/appwrite";
import {BackgroundSelector, BackgroundSelectorRef} from "@/components/C_CardBackgroundSelector";
import {MaterialIcons} from "@expo/vector-icons";

const LinkDetail = ({ card, onRefresh }: { card: ICard, onRefresh: () => void }) => {

    const [link, setLink] = useState(card.content);
    const [title, setTitle] = useState(card.title);
    const [isAdding, setIsAdding] = useState(false);

    const backgroundSelectorRef = useRef<BackgroundSelectorRef>(null);

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

    const handleSave = async () => {
        setIsAdding(true);
        try {
            await updateCard(card.$id, {
                content: link,
                title: title
            });

            card.content = link;
            card.title = title;

            await backgroundSelectorRef.current?.save();

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
                    <MaterialIcons name={"link"} size={32} style={{ color: colors.stone['900'] }}/>
                </TouchableOpacity>
            </View>

            <BackgroundSelector ref={backgroundSelectorRef} card={card} />

            <TouchableOpacity
                className="bg-green-700 p-4 rounded-xl border-solid border-green-800/50 border-4 items-center justify-center mt-6"
                onPress={handleSave}
                disabled={isAdding}
            >
                {isAdding ? (
                    <Text className="text-white font-dmsans-bold text-xl">Saving...</Text>
                ) : (
                    <View className="flex-row items-center gap-2">
                        <MaterialIcons name={"save"} size={24} style={{ color: 'white' }}/>
                        <Text className="text-white font-dmsans-bold text-xl">Save</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    )
}

export default LinkDetail;