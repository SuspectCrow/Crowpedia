import {ICard} from "@/interfaces/ICard";
import {Alert, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useRef, useState} from "react";
import colors from "tailwindcss/colors";
import {updateCard} from "@/lib/appwrite";
import {MaterialIcons} from "@expo/vector-icons";
import {BackgroundSelector, BackgroundSelectorRef} from "@/components/C_CardBackgroundSelector";
import {FolderSelector} from "@/components/C_FolderSelector";

const FolderDetail = ({ card, onRefresh }: { card: ICard, onRefresh: () => void }) => {
    // isEditing state'ini kaldırdık, artık hep düzenleme modundayız.

    const [title, setTitle] = useState(card.title);

    // Parent Folder State'i
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
        typeof card.parentFolder === 'object' && card.parentFolder
            ? (card.parentFolder as any).$id
            : (card.parentFolder || null)
    );

    const [isSaving, setIsSaving] = useState(false);

    const backgroundSelectorRef = useRef<BackgroundSelectorRef>(null);

    const handleSave = async () => {
        // Klasör kendisinin içine taşınamaz kontrolü
        if (selectedFolderId === card.$id) {
            Alert.alert("Hata", "Bir klasörü kendi içine taşıyamazsınız.");
            return;
        }

        setIsSaving(true);
        try {
            if (backgroundSelectorRef.current) {
                const bgData = backgroundSelectorRef.current.getValues();

                await updateCard(card.$id, {
                    title: title,
                    parentFolder: selectedFolderId,
                    background: bgData.background,
                    variant: bgData.variant
                });

                card.title = title;
                card.parentFolder = selectedFolderId!;
                card.background = bgData.background;
                card.variant = bgData.variant;

            } else {
                await updateCard(card.$id, {
                    title: title,
                    parentFolder: selectedFolderId
                });
                card.title = title;
                card.parentFolder = selectedFolderId!;
            }

            onRefresh();
            Alert.alert("Başarılı", "Değişiklikler kaydedildi.");

        } catch (error) {
            console.error("Klasör güncelleme hatası:", error);
            Alert.alert("Hata", "Klasör güncellenirken bir sorun oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View className="mx-4 mt-4">
            <View className="mb-4">
                <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Klasör Adı</Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Klasör Adı"
                    placeholderTextColor={colors.stone['600']}
                    className="w-full text-stone-400 font-dmsans-bold text-xl p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                />
            </View>

            <View className="mb-4">
                <FolderSelector
                    selectedFolderId={selectedFolderId}
                    onSelect={(id) => setSelectedFolderId(id)}
                />
            </View>

            <View className="mb-8">
                <Text className="text-stone-400 font-dmsans-bold text-xl mb-1">Görünüm</Text>
                <BackgroundSelector ref={backgroundSelectorRef} card={card} />
            </View>

            <TouchableOpacity
                className="bg-green-700 p-4 rounded-xl border-solid border-green-800/50 border-4 items-center justify-center mb-12"
                onPress={handleSave}
                disabled={isSaving}
            >
                {isSaving ? (
                    <Text className="text-white font-dmsans-bold text-xl">Kaydediliyor...</Text>
                ) : (
                    <View className="flex-row items-center gap-2">
                        <MaterialIcons name={"save"} size={24} style={{ color: 'white' }}/>
                        <Text className="text-white font-dmsans-bold text-xl">Değişiklikleri Kaydet</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default FolderDetail;