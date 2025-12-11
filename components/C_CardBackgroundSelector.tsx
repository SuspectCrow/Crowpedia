import {ICard} from "@/interfaces/ICard";
import {useEffect, useImperativeHandle, useState, forwardRef} from "react";
import {Alert, Image, Modal, Text, TextInput, TouchableOpacity, View} from "react-native";
import ColorPicker, {HueSlider, OpacitySlider, Panel1, Preview} from "reanimated-color-picker";
import {updateCard} from "@/lib/appwrite";
import {MaterialIcons} from "@expo/vector-icons";

interface BackgroundSelectorProps {
    card: ICard;
    onSaveSuccess?: () => void;
}

export interface BackgroundSelectorRef {
    save: () => Promise<void>;
}

export const BackgroundSelector = forwardRef<BackgroundSelectorRef, BackgroundSelectorProps>(
    ({ card, onSaveSuccess }, ref) => {
        const [isLargeCard, setIsLargeCard] = useState(false);
        const [showModal, setShowModal] = useState(false);
        const [selectedColor, setSelectedColor] = useState('#ff0000');
        const [tempColor, setTempColor] = useState('#ff0000');
        const [imageUrl, setImageUrl] = useState('');
        const [isSaving, setIsSaving] = useState(false);

        useEffect(() => {
            if (card.isLarge !== undefined) {
                setIsLargeCard(card.isLarge);
            }
            if (card.background) {
                if (card.background.startsWith('#')) {
                    setSelectedColor(card.background);
                    setTempColor(card.background);
                    setImageUrl('');
                } else {
                    setImageUrl(card.background);
                    setSelectedColor('#ff0000');
                }
            }
        }, [card]);

        useEffect(() => {
            if (isLargeCard && card.background && !card.background.startsWith('#')) {
                setImageUrl(card.background);
            } else if (isLargeCard) {
                setImageUrl('');
            }
        }, [isLargeCard]);

        useImperativeHandle(ref, () => ({
            save: async () => {
                setIsSaving(true);
                try {
                    const backgroundToSave = isLargeCard ? imageUrl : selectedColor;

                    await updateCard(card.$id, {
                        background: backgroundToSave,
                        isLarge: isLargeCard
                    });

                    card.background = backgroundToSave;
                    card.isLarge = isLargeCard;

                    console.log('Background kaydedildi:', { background: backgroundToSave, isLarge: isLargeCard });

                    onSaveSuccess?.();
                } catch (error) {
                    console.error("Background kaydetme hatası:", error);
                    Alert.alert("Hata", "Arka plan ayarları kaydedilirken bir sorun oluştu.");
                    throw error;
                } finally {
                    setIsSaving(false);
                }
            }
        }), [isLargeCard, imageUrl, selectedColor, card]);

        const handleConfirm = () => {
            setSelectedColor(tempColor);
            setShowModal(false);
            console.log('Geçici renk seçildi:', tempColor);
        };

        const handleCancel = () => {
            setTempColor(selectedColor);
            setShowModal(false);
        };

        return (
            <View className="mt-4 p-4"
                  style={{
                      backgroundColor: '#1c1917',
                      borderRadius: 12,
                      borderColor: '#0c0a09',
                      borderWidth: 4,
                  }}>
                <View className="mb-6">
                    <View className="flex-row bg-stone-800/50 rounded-xl p-1 border-2 border-stone-700/30">
                        <TouchableOpacity
                            onPress={() => setIsLargeCard(false)}
                            disabled={isSaving}
                            className={`flex-1 py-2 px-3 rounded-lg items-center ${
                                !isLargeCard
                                    ? 'bg-stone-700'
                                    : 'bg-transparent'
                            }`}
                        >
                            <Text className={`font-dmsans-bold text-base ${
                                !isLargeCard ? 'text-white' : 'text-stone-400'
                            }`}>Small</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setIsLargeCard(true)}
                            disabled={isSaving}
                            className={`flex-1 py-2 px-3 rounded-lg items-center ${
                                isLargeCard
                                    ? 'bg-stone-700'
                                    : 'bg-transparent'
                            }`}
                        >
                            <Text className={`font-dmsans-bold text-base ${
                                isLargeCard ? 'text-white' : 'text-stone-400'
                            }`}>Large</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View>
                    {isLargeCard ? (
                        <View>
                            <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Background Image URL</Text>
                            <TextInput
                                value={imageUrl}
                                onChangeText={setImageUrl}
                                placeholder="https://example.com/image.jpg"
                                placeholderTextColor={'#57534e'}
                                keyboardType="url"
                                autoCapitalize="none"
                                className="w-full text-stone-400 font-dmsans-bold text-xl p-3 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                            />

                            {imageUrl && imageUrl.trim() !== '' && (
                                <View className="mt-4">
                                    <Text className="text-stone-400 font-dmsans-bold text-base mb-2 text-center">Preview</Text>
                                    <View className="rounded-xl border-4 border-stone-700/50 overflow-hidden h-48 mx-auto" style={{ aspectRatio: 9/16 }}>
                                        <Image
                                            source={{ uri: imageUrl }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                            onError={() => {
                                                console.log('Image yükleme hatası');
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View>
                            <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Background Color</Text>

                            <View className="flex-row items-center gap-3">
                                <View className="flex-row items-center gap-2 flex-1 p-2 rounded-lg border-2 border-stone-700/50 bg-stone-900/50">
                                    <View
                                        className="w-10 h-10 rounded-lg border-2 border-stone-700/50"
                                        style={{ backgroundColor: selectedColor }}
                                    />
                                    <Text className="text-stone-300 font-dmsans-medium text-sm flex-1">{selectedColor}</Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        setTempColor(selectedColor);
                                        setShowModal(true);
                                    }}
                                    disabled={isSaving}
                                    className="bg-stone-700 p-3 rounded-lg border-2 border-stone-800/50 items-center justify-center"
                                >
                                    <View className="flex-row items-center gap-1">
                                        <MaterialIcons name={"format-color-fill"} size={20} color={'#fff'} />
                                        <Text className="text-white font-dmsans-bold text-sm">Change Color</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Modal
                                visible={showModal}
                                animationType='fade'
                                transparent={true}
                                onRequestClose={handleCancel}
                            >
                                <View className="flex-1 justify-center items-center bg-black/80">
                                    <View className="w-[90%] bg-stone-900 rounded-2xl border-4 border-stone-700 p-6">
                                        <Text className="text-stone-200 font-dmsans-bold text-2xl mb-4 text-center">
                                            Color Picker
                                        </Text>

                                        <ColorPicker
                                            style={{ width: '100%', marginBottom: 20 }}
                                            value={tempColor}
                                            onChangeJS={({ hex }) => setTempColor(hex)}
                                        >
                                            <Preview style={{ marginBottom: 12 }}/>
                                            <Panel1 style={{ marginBottom: 12 }}/>
                                            <HueSlider style={{ marginBottom: 12 }} />
                                            <OpacitySlider style={{ marginBottom: 12 }} />
                                        </ColorPicker>

                                        <View className="flex-row gap-4">
                                            <TouchableOpacity
                                                onPress={handleCancel}
                                                className="flex-1 bg-stone-700 p-4 rounded-xl border-4 border-stone-800/50 items-center"
                                            >
                                                <Text className="text-white font-dmsans-bold text-xl">Cancel</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={handleConfirm}
                                                className="flex-1 bg-green-700 p-4 rounded-xl border-4 border-green-800/50 items-center"
                                            >
                                                <Text className="text-white font-dmsans-bold text-xl">Change</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    )}
                </View>

                {isSaving && (
                    <View className="mt-4">
                        <Text className="text-stone-400 font-dmsans-regular text-center">
                            Arka plan ayarları kaydediliyor...
                        </Text>
                    </View>
                )}
            </View>
        );
    }
);