import React, {useRef, useState} from "react";
import {Alert, ScrollView, Switch, Text, TextInput, TouchableOpacity, View} from "react-native";
import {createCard} from "@/lib/appwrite";
import {BackgroundSelector, BackgroundSelectorRef} from "@/components/C_CardBackgroundSelector";
import {FolderSelector} from "@/components/C_FolderSelector";
import colors from "tailwindcss/colors";
import {ICard, CardVariant} from "@/interfaces/ICard";
import {MaterialIcons} from "@expo/vector-icons";
import {router} from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';

interface EventCreateProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const TZ = 'Europe/Istanbul';

const formatTRWeekDate = (d: Date) =>
    new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ }).format(d);

const formatTRTime = (d: Date) =>
    new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).format(d);

const dateToTimestamp = (d: Date | null): string => {
    if (!d) return '';
    return Math.floor(d.getTime() / 1000).toString();
};

const EventCreate = ({ onClose, onSuccess }: EventCreateProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [isOnline, setIsOnline] = useState(false);
    const [importance, setImportance] = useState('1');
    const [eventDate, setEventDate] = useState(new Date());

    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const backgroundSelectorRef = useRef<BackgroundSelectorRef>(null);

    const initialCard: ICard = {
        $id: '',
        order: 10,
        title: '',
        content: '',
        type: 'Note',
        background: '#333',
        variant: CardVariant.SMALL
    };

    const handleCreate = async () => {
        if (!title.trim()) {
            Alert.alert("Eksik Bilgi", "Lütfen etkinlik için bir başlık giriniz.");
            return;
        }

        setIsCreating(true);

        try {
            let backgroundData = { background: '#333', variant: CardVariant.SMALL };

            if (backgroundSelectorRef.current) {
                backgroundData = backgroundSelectorRef.current.getValues();
            }

            const contentObj = {
                timestamp: dateToTimestamp(eventDate),
                description: description.trim(),
                location: location.trim(),
                isOnline: isOnline,
                importance: parseInt(importance) || 1
            };

            const newCardData: ICard = {
                title: title.trim(),
                type: 'Event',
                content: JSON.stringify(contentObj),
                background: backgroundData.background,
                variant: backgroundData.variant,
                parentFolder: selectedFolderId,
            } as ICard;

            await createCard(newCardData);

            Alert.alert("Başarılı", "Etkinlik oluşturuldu!", [
                {
                    text: "Tamam",
                    onPress: () => {
                        if (onSuccess) onSuccess();
                        else router.replace('/home');
                    }
                }
            ]);

        } catch (error) {
            console.error("Create Event Error:", error);
            Alert.alert("Hata", "Etkinlik oluşturulurken bir sorun oluştu.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <View className="flex-1 bg-stone-950">
            <View className="p-4 border-b-4 border-stone-800 bg-stone-900 z-10">
                <Text className="text-stone-200 font-dmsans-bold text-2xl text-center">
                    Yeni Etkinlik Oluştur
                </Text>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                <View className="mb-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Başlık</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Etkinlik Başlığı..."
                        placeholderTextColor={colors.stone['600']}
                        className="w-full text-stone-300 font-dmsans-bold text-xl p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                <View className="mb-4">
                    <FolderSelector
                        selectedFolderId={selectedFolderId}
                        onSelect={(id) => setSelectedFolderId(id)}
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Açıklama</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Etkinlik açıklaması..."
                        placeholderTextColor={colors.stone['600']}
                        multiline
                        numberOfLines={3}
                        className="w-full text-stone-300 font-dmsans-regular text-lg p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                <View className="mb-4">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-stone-400 font-dmsans-bold text-xl">
                            {isOnline ? "Link (Online Etkinlik)" : "Konum"}
                        </Text>
                        <View className="flex-row items-center gap-2">
                            <Text className="text-stone-400 font-dmsans-medium text-sm">Online</Text>
                            <Switch
                                value={isOnline}
                                onValueChange={setIsOnline}
                                trackColor={{ false: colors.stone['700'], true: colors.green['700'] }}
                                thumbColor={isOnline ? colors.green['500'] : colors.stone['400']}
                            />
                        </View>
                    </View>
                    <TextInput
                        value={location}
                        onChangeText={setLocation}
                        placeholder={isOnline ? "https://zoom.us/..." : "Etkinlik konumu"}
                        placeholderTextColor={colors.stone['600']}
                        className="w-full text-stone-300 font-dmsans-regular text-lg p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Önem Derecesi (1-5)</Text>
                    <TextInput
                        value={importance}
                        onChangeText={(text) => {
                            if (text === '' || (/^[1-5]$/.test(text))) {
                                setImportance(text);
                            }
                        }}
                        placeholder="1"
                        placeholderTextColor={colors.stone['600']}
                        keyboardType="numeric"
                        maxLength={1}
                        className="w-full text-stone-300 font-dmsans-bold text-xl p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                <View className="flex-row gap-4 mb-6">
                    <View className="flex-1">
                        <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Tarih</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="w-full p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                        >
                            <Text className="text-blue-500 font-dmsans-medium text-lg">
                                {formatTRWeekDate(eventDate)}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={eventDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        const newDate = new Date(eventDate);
                                        newDate.setFullYear(selectedDate.getFullYear());
                                        newDate.setMonth(selectedDate.getMonth());
                                        newDate.setDate(selectedDate.getDate());
                                        setEventDate(newDate);
                                    }
                                }}
                            />
                        )}
                    </View>

                    <View className="flex-1">
                        <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Saat</Text>
                        <TouchableOpacity
                            onPress={() => setShowTimePicker(true)}
                            className="w-full p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                        >
                            <Text className="text-purple-500 font-dmsans-medium text-lg">
                                {formatTRTime(eventDate)}
                            </Text>
                        </TouchableOpacity>

                        {showTimePicker && (
                            <DateTimePicker
                                value={eventDate}
                                mode="time"
                                display="default"
                                onChange={(event, selectedTime) => {
                                    setShowTimePicker(false);
                                    if (selectedTime) {
                                        const newDate = new Date(eventDate);
                                        newDate.setHours(selectedTime.getHours());
                                        newDate.setMinutes(selectedTime.getMinutes());
                                        setEventDate(newDate);
                                    }
                                }}
                            />
                        )}
                    </View>
                </View>

                <View className="mb-20">
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

export default EventCreate;