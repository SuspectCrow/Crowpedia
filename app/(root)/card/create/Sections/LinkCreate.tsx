import React, {useRef, useState} from "react";
import {Alert, Linking, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {createCard} from "@/lib/appwrite";
import {BackgroundSelector, BackgroundSelectorRef} from "@/components/C_CardBackgroundSelector";
import {FolderSelector} from "@/components/C_FolderSelector";
import colors from "tailwindcss/colors";
import {ICard} from "@/interfaces/ICard";
import {MaterialIcons} from "@expo/vector-icons";
import {router} from "expo-router";

interface LinkCreateProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const LinkCreate = ({ onClose, onSuccess }: LinkCreateProps) => {
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
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

    const handleCreate = async () => {
        if (!title.trim()) {
            Alert.alert("Eksik Bilgi", "Lütfen link için bir başlık giriniz.");
            return;
        }
        if (!link.trim()) {
            Alert.alert("Eksik Bilgi", "Lütfen bir URL giriniz.");
            return;
        }

        setIsCreating(true);

        try {
            let backgroundData = { background: '#333', isLarge: false };

            if (backgroundSelectorRef.current) {
                backgroundData = backgroundSelectorRef.current.getValues();
            }

            const newCardData: ICard = {
                title: title.trim(),
                type: 'Link',
                content: link.trim(),
                background: backgroundData.background,
                isLarge: backgroundData.isLarge,
                parentFolder: selectedFolderId,
            } as ICard;

            await createCard(newCardData);

            Alert.alert("Başarılı", "Link oluşturuldu!", [
                {
                    text: "Tamam",
                    onPress: () => {
                        if (onSuccess) onSuccess();
                        else router.replace('/home');
                    }
                }
            ]);

        } catch (error) {
            console.error("Create Link Error:", error);
            Alert.alert("Hata", "Link oluşturulurken bir sorun oluştu.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <View className="flex-1 bg-stone-950">
            <View className="p-4 border-b-4 border-stone-800 bg-stone-900 z-10">
                <Text className="text-stone-200 font-dmsans-bold text-2xl text-center">
                    Yeni Link Ekle
                </Text>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                <View className="mb-6">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Başlık</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Link Başlığı (örn: Google)"
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
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">URL Adresi</Text>
                    <View className="flex-row items-center gap-2">
                        <TextInput
                            value={link}
                            onChangeText={setLink}
                            placeholder="https://example.com"
                            placeholderTextColor={colors.stone['600']}
                            keyboardType="url"
                            autoCapitalize="none"
                            className="flex-1 text-stone-300 font-dmsans-bold text-xl p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                        />
                        <TouchableOpacity
                            onPress={handleOpenLink}
                            className="p-4 bg-stone-700 rounded-xl border-4 border-stone-700/50 items-center justify-center"
                        >
                            <MaterialIcons name={"open-in-new"} size={28} color={colors.stone['300']}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-8">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-1">Görünüm</Text>
                    <BackgroundSelector
                        ref={backgroundSelectorRef}
                        card={initialCard}
                    />
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
                            <Text className="text-white font-dmsans-bold text-lg text-center">Ekleniyor...</Text>
                        ) : (
                            <>
                                <MaterialIcons name="save" size={24} color="white" />
                                <Text className="text-white font-dmsans-bold text-lg text-center">Ekle</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LinkCreate;