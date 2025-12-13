import React, {useRef, useState} from "react";
import {Alert, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {createCard} from "@/lib/appwrite";
import {BackgroundSelector, BackgroundSelectorRef} from "@/components/C_CardBackgroundSelector";
import {FolderSelector} from "@/components/C_FolderSelector";
import colors from "tailwindcss/colors";
import {ICard} from "@/interfaces/ICard";
import {MaterialIcons} from "@expo/vector-icons";
import {router} from "expo-router";

interface CollectionCreateProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const PRESETS = [
    { id: 'media', label: 'Media (Film/Dizi)', icon: 'movie' },
];

const CollectionCreate = ({ onClose, onSuccess }: CollectionCreateProps) => {
    const [title, setTitle] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('media'); // Varsayılan: media
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

    const handleCreate = async () => {
        if (!title.trim()) {
            Alert.alert("Eksik Bilgi", "Lütfen koleksiyon için bir başlık giriniz.");
            return;
        }

        setIsCreating(true);

        try {
            let backgroundData = { background: '#333', isLarge: false };

            if (backgroundSelectorRef.current) {
                backgroundData = backgroundSelectorRef.current.getValues();
            }

            // Collection yapısına uygun başlangıç content'i
            const contentObj = {
                preset: selectedPreset,
                items: [] // Başlangıçta boş liste
            };

            const newCardData: ICard = {
                title: title.trim(),
                type: 'Collection',
                content: JSON.stringify(contentObj),
                background: backgroundData.background,
                isLarge: backgroundData.isLarge,
                parentFolder: selectedFolderId,
            } as ICard;

            await createCard(newCardData);

            Alert.alert("Başarılı", "Koleksiyon oluşturuldu!", [
                {
                    text: "Tamam",
                    onPress: () => {
                        if (onSuccess) onSuccess();
                        else router.replace('/home');
                    }
                }
            ]);

        } catch (error) {
            console.error("Create Collection Error:", error);
            Alert.alert("Hata", "Koleksiyon oluşturulurken bir sorun oluştu.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <View className="flex-1 bg-stone-950">
            <View className="p-4 border-b-4 border-stone-800 bg-stone-900 z-10">
                <Text className="text-stone-200 font-dmsans-bold text-2xl text-center">
                    Yeni Koleksiyon
                </Text>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                {/* Başlık */}
                <View className="mb-6">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Başlık</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Koleksiyon Başlığı..."
                        placeholderTextColor={colors.stone['600']}
                        className="w-full text-stone-300 font-dmsans-bold text-xl p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                {/* Klasör Seçimi */}
                <View className="mb-6">
                    <FolderSelector
                        selectedFolderId={selectedFolderId}
                        onSelect={(id) => setSelectedFolderId(id)}
                    />
                </View>

                {/* Preset Seçimi */}
                <View className="mb-6">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Koleksiyon Türü</Text>
                    <View className="flex-row gap-3 flex-wrap">
                        {PRESETS.map((preset) => (
                            <TouchableOpacity
                                key={preset.id}
                                onPress={() => setSelectedPreset(preset.id)}
                                className={`flex-row items-center gap-2 p-3 rounded-xl border-4 ${
                                    selectedPreset === preset.id
                                        ? 'bg-amber-900/20 border-amber-600/50'
                                        : 'bg-stone-900/50 border-stone-700/50'
                                }`}
                            >
                                <MaterialIcons
                                    name={preset.icon as any}
                                    size={24}
                                    color={selectedPreset === preset.id ? colors.amber[500] : colors.stone[400]}
                                />
                                <Text className={`font-dmsans-bold text-base ${
                                    selectedPreset === preset.id ? 'text-amber-500' : 'text-stone-400'
                                }`}>
                                    {preset.label}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {/* Gelecek Özellikler İçin Placeholder (Opsiyonel) */}
                        <View className="p-3 rounded-xl border-4 border-stone-800/30 bg-stone-900/30 opacity-50">
                            <Text className="text-stone-600 font-dmsans-medium text-sm">Daha fazlası yakında...</Text>
                        </View>
                    </View>
                </View>

                {/* Görünüm Ayarları */}
                <View className="mb-8">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-1">Görünüm</Text>
                    <BackgroundSelector
                        ref={backgroundSelectorRef}
                        card={initialCard}
                    />
                </View>
            </ScrollView>

            {/* Alt Butonlar */}
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
                            <Text className="text-white font-dmsans-bold text-lg text-center">Oluşturuluyor...</Text>
                        ) : (
                            <>
                                <MaterialIcons name="save" size={24} color="white" />
                                <Text className="text-white font-dmsans-bold text-lg text-center">Oluştur</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default CollectionCreate;