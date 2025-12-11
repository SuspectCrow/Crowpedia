import {ICard} from "@/interfaces/ICard";
import {Alert, Linking, Text, TextInput, TouchableOpacity, View, Switch, ScrollView, Image} from "react-native";
import React, {useRef, useState} from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from "tailwindcss/colors";
import {updateCard} from "@/lib/appwrite";
import {MaterialIcons} from "@expo/vector-icons";
import {BackgroundSelector, BackgroundSelectorRef} from "@/components/C_CardBackgroundSelector";

const TZ = 'Europe/Istanbul';

const toDate = (val: any): Date | null => {
    if (val === null || val === undefined) return null;
    const s = String(val).trim();
    if (!s) return null;
    if (/^\d+$/.test(s)) {
        const n = Number(s);
        const ms = s.length <= 10 ? n * 1000 : n;
        const d = new Date(ms);
        return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
};

const formatTRWeekDate = (d: Date) =>
    new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ }).format(d);

const formatTRTime = (d: Date) =>
    new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).format(d);

const dateToTimestamp = (d: Date | null): string => {
    if (!d) return '';
    return Math.floor(d.getTime() / 1000).toString();
};

interface ImportanceProgressBarProps {
    importance: number;
}

const ImportanceProgressBar: React.FC<ImportanceProgressBarProps> = ({ importance }) => {
    const level = Math.max(1, Math.min(5, importance));

    const getColor = (level: number): string => {
        const colors: Record<number, string> = {
            1: '#22c55e',
            2: '#84cc16',
            3: '#eab308',
            4: '#f97316',
            5: '#ef4444',
        };
        return colors[level];
    };

    const color = getColor(level);
    const percentage = (level / 5) * 100;

    return (
        <View className="w-full">
            <View className="flex-row items-center justify-between mb-2">
                <Text className="font-dmsans-medium text-sm text-stone-400">
                    Önem Derecesi
                </Text>
                <View className="flex-row items-center gap-1">
                    <MaterialIcons name="flag" size={16} style={{ color }} />
                    <Text className="font-dmsans-bold text-sm" style={{ color }}>
                        {level}/5
                    </Text>
                </View>
            </View>

            <View className="h-3 bg-stone-800 rounded-full overflow-hidden">
                <View
                    className="h-full rounded-full"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color
                    }}
                />
            </View>

            <View className="flex-row justify-between mt-1 px-1">
                {[1, 2, 3, 4, 5].map((num) => (
                    <View
                        key={num}
                        className="w-1 h-1 rounded-full"
                        style={{
                            backgroundColor: num <= level ? color : '#57534e'
                        }}
                    />
                ))}
            </View>
        </View>
    );
};

const EventDetail = ({ card, parsedCardContent, onRefresh }: { card: ICard, parsedCardContent: any, onRefresh: () => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(parsedCardContent?.description ?? '');
    const [location, setLocation] = useState(parsedCardContent?.location ?? '');
    const [isOnline, setIsOnline] = useState(parsedCardContent?.isOnline ?? false);
    const [importance, setImportance] = useState(String(parsedCardContent?.importance ?? 1));
    const [isSaving, setIsSaving] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const raw = parsedCardContent?.timestamp ?? card.content ?? '';
    const initialDate = toDate(raw) || new Date();
    const [eventDate, setEventDate] = useState(initialDate);

    const backgroundSelectorRef = useRef<BackgroundSelectorRef>(null);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedContent = JSON.stringify({
                timestamp: dateToTimestamp(eventDate),
                description: description.trim(),
                location: location.trim(),
                isOnline: isOnline,
                importance: parseInt(importance) || 1
            });

            await updateCard(card.$id, {
                content: updatedContent,
                title: title.trim()
            });

            card.content = updatedContent;
            card.title = title.trim();

            await backgroundSelectorRef.current?.save();

            onRefresh();
            setIsEditing(false);
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            Alert.alert("Hata", "Etkinlik güncellenirken bir sorun oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setTitle(card.title);
        setDescription(parsedCardContent?.description ?? '');
        setLocation(parsedCardContent?.location ?? '');
        setIsOnline(parsedCardContent?.isOnline ?? false);
        setImportance(String(parsedCardContent?.importance ?? 1));
        setEventDate(initialDate);
        setIsEditing(false);
        onRefresh();
    };

    const handleOpenLocation = () => {
        if (!location) return;

        if (isOnline) {
            if (location.startsWith('http://') || location.startsWith('https://')) {
                Linking.openURL(location).catch(err => {
                    Alert.alert("Hata", "Link açılamadı.");
                    console.error("Link açma hatası:", err);
                });
            } else {
                Alert.alert("Geçersiz Link", "Lütfen geçerli bir URL girin (http:// veya https:// ile başlamalı)");
            }
        } else {
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
            Linking.openURL(url).catch(err => {
                Alert.alert("Hata", "Harita açılamadı.");
                console.error("Harita açma hatası:", err);
            });
        }
    };

    const d = toDate(raw);

    const getTimeRemaining = () => {
        if (!d) return null;
        const now = new Date();
        const diff = d.getTime() - now.getTime();

        if (diff < 0) {
            return { passed: true, text: 'Etkinlik geçti' };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return { passed: false, text: `${days} gün ${hours} saat` };
        } else if (hours > 0) {
            return { passed: false, text: `${hours} saat ${minutes} dakika` };
        } else {
            return { passed: false, text: `${minutes} dakika` };
        }
    };

    const timeRemaining = getTimeRemaining();

    if (isEditing) {
        return (
            <ScrollView className="mx-4 mt-4" showsVerticalScrollIndicator={false}>
                <View className="mb-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Başlık</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Etkinlik Başlığı"
                        placeholderTextColor={colors.stone['600']}
                        className="w-full text-stone-400 font-dmsans-bold text-xl p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Açıklama</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Etkinlik açıklaması"
                        placeholderTextColor={colors.stone['600']}
                        multiline
                        numberOfLines={3}
                        className="w-full text-stone-400 font-dmsans-regular text-lg p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
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
                        className="w-full text-stone-400 font-dmsans-regular text-lg p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Önem Derecesi (1-5)</Text>
                    <TextInput
                        value={importance}
                        onChangeText={setImportance}
                        placeholder="1"
                        placeholderTextColor={colors.stone['600']}
                        keyboardType="numeric"
                        maxLength={1}
                        className="w-full text-stone-400 font-dmsans-bold text-xl p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                <View className="flex-row gap-4 mb-4">
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

                <BackgroundSelector ref={backgroundSelectorRef} card={card} />

                <View className="flex-row gap-4 mt-6 mb-4">
                    <TouchableOpacity
                        className="flex-1 bg-stone-700 p-4 rounded-xl border-solid border-stone-800/50 border-4 items-center justify-center"
                        onPress={handleCancel}
                        disabled={isSaving}
                    >
                        <Text className="text-white font-dmsans-bold text-xl">İptal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 bg-green-700 p-4 rounded-xl border-solid border-green-800/50 border-4 items-center justify-center"
                        onPress={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <Text className="text-white font-dmsans-bold text-xl">Kaydediliyor...</Text>
                        ) : (
                            <View className="flex-row items-center gap-2">
                                <MaterialIcons name={"save"} size={24} style={{ color: 'white' }}/>
                                <Text className="text-white font-dmsans-bold text-xl">Kaydet</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    if (d) {
        const formattedDate = formatTRWeekDate(d);
        const formattedTime = formatTRTime(d);
        return (
            <View className="h-full">
                <View className="flex-col items-center justify-start gap-4 mt-12">
                    <View>
                        <Text className="font-dmsans-bold text-4xl text-stone-300 text-center">{card.title}</Text>
                    </View>
                    {parsedCardContent?.location && (
                        <View className="flex-row items-center justify-start gap-2">
                            <MaterialIcons
                                name={parsedCardContent?.isOnline ? "link" : "location-on"}
                                size={20}
                                style={{ color: colors.stone['500'] }}
                            />
                            <Text className={`font-dmsans-light text-xl ${isOnline ? 'text-green-600' : 'text-stone-500'}`}>
                                { isOnline ? `Online Event` : `${parsedCardContent?.location}` }
                            </Text>
                        </View>
                    )}
                    <View className="flex-row items-center justify-start gap-4">
                        <Text className="font-dmsans-medium text-md text-stone-500">{formattedDate}</Text>
                        <Text className="font-dmsans-bold text-md text-stone-500">{formattedTime}</Text>
                    </View>
                    {timeRemaining && (
                        <View className="flex-row items-center justify-center gap-2 px-4 py-2 bg-stone-800/50 rounded-xl border-2 border-stone-700">
                            <MaterialIcons
                                name="schedule"
                                size={20}
                                style={{ color: timeRemaining.passed ? colors.red['500'] : colors.blue['500'] }}
                            />
                            <Text
                                className="font-dmsans-bold text-lg"
                                style={{ color: timeRemaining.passed ? colors.red['500'] : colors.blue['500'] }}
                            >
                                {timeRemaining.text}
                            </Text>
                        </View>
                    )}
                    {parsedCardContent?.description && (
                        <View>
                            <Text className="font-dmsans-regular text-xl text-stone-200 text-center">
                                {parsedCardContent?.description}
                            </Text>
                        </View>
                    )}
                    {parsedCardContent?.importance && (
                        <ImportanceProgressBar importance={parsedCardContent.importance} />
                    )}
                </View>

                <View className="mt-auto mb-12 gap-4">
                    {parsedCardContent?.location && (
                        <TouchableOpacity
                            className="bg-blue-700 p-4 rounded-xl border-solid border-blue-800/50 border-4 items-center justify-center"
                            onPress={handleOpenLocation}
                        >
                            <View className="flex-row items-center gap-2">
                                <MaterialIcons
                                    name={parsedCardContent?.isOnline ? "open-in-new" : "map"}
                                    size={24}
                                    style={{ color: 'white' }}
                                />
                                <Text className="text-white font-dmsans-bold text-xl">
                                    {parsedCardContent?.isOnline ? "Linki Aç" : "Haritada Göster"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        className="bg-green-700 p-4 rounded-xl border-solid border-green-800/50 border-4 items-center justify-center"
                        onPress={() => setIsEditing(true)}
                    >
                        <View className="flex-row items-center gap-2">
                            <MaterialIcons name={"edit-note"} size={24} style={{ color: 'white' }}/>
                            <Text className="text-white font-dmsans-bold text-xl">Düzenle</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return <Text className="font-dmsans-black text-4xl text-red-600">{String(raw)}</Text>;
};

export default EventDetail;