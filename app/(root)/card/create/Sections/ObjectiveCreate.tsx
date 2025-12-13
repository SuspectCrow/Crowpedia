import React, {useRef, useState} from "react";
import {Alert, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {createCard} from "@/lib/appwrite";
import {BackgroundSelector, BackgroundSelectorRef} from "@/components/C_CardBackgroundSelector";
import {FolderSelector} from "@/components/C_FolderSelector";
import colors from "tailwindcss/colors";
import {ICard} from "@/interfaces/ICard";
import {MaterialIcons} from "@expo/vector-icons";
import {router} from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';

interface ObjectiveCreateProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const TZ = 'Europe/Istanbul';

const formatTRDate = (d: Date) =>
    new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ }).format(d);

const dateToTimestamp = (d: Date | null): string => {
    if (!d) return '';
    return Math.floor(d.getTime() / 1000).toString();
};

const ObjectiveCreate = ({ onClose, onSuccess }: ObjectiveCreateProps) => {
    const [title, setTitle] = useState('');

    // Tarih State'leri
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

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
            Alert.alert("Eksik Bilgi", "Lütfen hedef için bir başlık giriniz.");
            return;
        }

        // Bitiş tarihi başlangıçtan önce mi kontrolü (Opsiyonel ama mantıklı)
        if (endDate < startDate) {
            Alert.alert("Hata", "Bitiş tarihi başlangıç tarihinden önce olamaz.");
            return;
        }

        setIsCreating(true);

        try {
            let backgroundData = { background: '#333', isLarge: false };

            if (backgroundSelectorRef.current) {
                backgroundData = backgroundSelectorRef.current.getValues();
            }

            // İçeriği JSON string olarak hazırlıyoruz
            const contentObj = {
                startdate: dateToTimestamp(startDate),
                enddate: dateToTimestamp(endDate)
            };

            const newCardData: ICard = {
                title: title.trim(),
                type: 'Objective',
                content: JSON.stringify(contentObj),
                background: backgroundData.background,
                isLarge: backgroundData.isLarge,
                parentFolder: selectedFolderId,
            } as ICard;

            await createCard(newCardData);

            Alert.alert("Başarılı", "Hedef oluşturuldu!", [
                {
                    text: "Tamam",
                    onPress: () => {
                        if (onSuccess) onSuccess();
                        else router.replace('/home');
                    }
                }
            ]);

        } catch (error) {
            console.error("Create Objective Error:", error);
            Alert.alert("Hata", "Hedef oluşturulurken bir sorun oluştu.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <View className="flex-1 bg-stone-950">
            <View className="p-4 border-b-4 border-stone-800 bg-stone-900 z-10">
                <Text className="text-stone-200 font-dmsans-bold text-2xl text-center">
                    Yeni Hedef Belirle
                </Text>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                {/* Başlık */}
                <View className="mb-6">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Başlık</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Hedef Başlığı..."
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

                {/* Tarih Seçimi */}
                <View className="mb-6">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Tarih Aralığı</Text>
                    <View className="flex-row gap-4">
                        {/* Başlangıç Tarihi */}
                        <View className="flex-1">
                            <Text className="text-stone-500 font-dmsans-medium text-sm mb-1">Başlangıç</Text>
                            <TouchableOpacity
                                onPress={() => setShowStartPicker(true)}
                                className="w-full p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                            >
                                <Text className="text-red-500 font-dmsans-medium text-lg text-center">
                                    {formatTRDate(startDate)}
                                </Text>
                            </TouchableOpacity>

                            {showStartPicker && (
                                <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowStartPicker(false);
                                        if (selectedDate) {
                                            setStartDate(selectedDate);
                                            // Eğer bitiş tarihi başlangıçtan geride kalırsa onu da güncelle
                                            if (selectedDate > endDate) {
                                                setEndDate(selectedDate);
                                            }
                                        }
                                    }}
                                />
                            )}
                        </View>

                        {/* Ok İşareti */}
                        <View className="justify-center mt-6">
                            <MaterialIcons name="arrow-right-alt" size={24} color={colors.stone[500]} />
                        </View>

                        {/* Bitiş Tarihi */}
                        <View className="flex-1">
                            <Text className="text-stone-500 font-dmsans-medium text-sm mb-1">Bitiş</Text>
                            <TouchableOpacity
                                onPress={() => setShowEndPicker(true)}
                                className="w-full p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                            >
                                <Text className="text-green-500 font-dmsans-medium text-lg text-center">
                                    {formatTRDate(endDate)}
                                </Text>
                            </TouchableOpacity>

                            {showEndPicker && (
                                <DateTimePicker
                                    value={endDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowEndPicker(false);
                                        if (selectedDate) {
                                            setEndDate(selectedDate);
                                        }
                                    }}
                                />
                            )}
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

export default ObjectiveCreate;