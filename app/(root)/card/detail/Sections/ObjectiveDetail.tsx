import {ICard} from "@/interfaces/ICard";
import {Alert, Image, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import icons from "@/constants/icons";
import colors from "tailwindcss/colors";
import {updateCard} from "@/lib/appwrite";

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

const formatTRDate = (d: Date) =>
    new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ }).format(d);

const daysUntil = (target: Date, from: Date = new Date()): number => {
    const fromStart = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const diff = Math.ceil((targetStart.getTime() - fromStart.getTime()) / 86400000);
    return Math.max(0, diff);
};

const dateToTimestamp = (d: Date | null): string => {
    if (!d) return '';
    return Math.floor(d.getTime() / 1000).toString();
};

const ObjectiveDetail = ({ card, parsedCardContent, onRefresh }: { card: ICard, parsedCardContent: any, onRefresh: () => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(card.title);
    const [isSaving, setIsSaving] = useState(false);

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const initialStartDate = toDate(parsedCardContent?.startdate) || new Date();
    const initialEndDate = toDate(parsedCardContent?.enddate) || new Date();

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const stRaw = parsedCardContent?.startdate ?? null;
    const etRaw = parsedCardContent?.enddate ?? null;
    const sd = toDate(stRaw);
    const ed = toDate(etRaw);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedContent = JSON.stringify({
                startdate: dateToTimestamp(startDate),
                enddate: dateToTimestamp(endDate)
            });

            await updateCard(card.$id, {
                content: updatedContent,
                title: title
            });

            card.content = updatedContent;
            card.title = title;

            onRefresh();
            setIsEditing(false);
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            Alert.alert("Hata", "Hedef güncellenirken bir sorun oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setTitle(card.title);
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);
        setIsEditing(false);
        onRefresh();
    };

    if (sd || ed) {
        const formattedStartDate = sd ? formatTRDate(sd) : '-';
        const formattedEndDate = ed ? formatTRDate(ed) : '-';
        const startLeftDays = sd ? daysUntil(sd) : null;
        const endLeftDays = ed ? daysUntil(ed) : null;

        if (isEditing) {
            return (
                <View className="mx-4 mt-4">
                    {/* Title */}
                    <View className="mb-4">
                        <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Başlık</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Başlık Girin"
                            placeholderTextColor={colors.stone['600']}
                            className="w-full text-stone-400 font-dmsans-bold text-xl p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                        />
                    </View>

                    {/* Start Date & End Date - Side by Side */}
                    <View className="flex-row gap-4 mb-4">
                        <View className="flex-1">
                            <TouchableOpacity
                                onPress={() => setShowStartPicker(true)}
                                className="w-full p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                            >
                                <Text className="text-red-500 font-dmsans-medium text-lg">
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
                                        }
                                    }}
                                />
                            )}
                        </View>

                        <View className="flex-1">
                            <TouchableOpacity
                                onPress={() => setShowEndPicker(true)}
                                className="w-full p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                            >
                                <Text className="text-green-500 font-dmsans-medium text-lg">
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

                    {/* Action Buttons */}
                    <View className="flex-row gap-4 mt-6">
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
                                    <Image
                                        source={icons.save}
                                        className="size-6"
                                        style={[{ tintColor: '#fff' }]}
                                    />
                                    <Text className="text-white font-dmsans-bold text-xl">Kaydet</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return (
            <View className="h-full">
                <View className="flex-col items-center justify-start gap-4 mt-12">
                    <View>
                        <Text className="font-dmsans-bold text-4xl text-stone-300 text-center">{card.title}</Text>
                    </View>
                    <View className="flex-row items-center justify-start gap-4">
                        <Text className="font-dmsans-medium text-md text-red-500">{formattedStartDate}</Text>
                        <Text className="font-dmsans-black text-md text-stone-200">{"->"}</Text>
                        <Text className="font-dmsans-medium text-md text-green-500">{formattedEndDate}</Text>
                    </View>
                    <View>
                        <Text className="font-dmsans-bold text-xl text-stone-300 text-center">
                            Başlangıç'a kalan gün: {startLeftDays ?? '-'} gün
                        </Text>
                        <Text className="font-dmsans-bold text-xl text-stone-300 text-center">
                            Sonuna kalan gün: {endLeftDays ?? '-'} gün
                        </Text>
                    </View>
                    <View>
                        <Text className="font-dmsans-regular text-xl text-stone-200 text-center">{parsedCardContent?.description ?? ''}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-green-700 p-4 rounded-xl border-solid border-green-800/50 border-4 items-center justify-center mt-auto mb-12"
                    onPress={() => setIsEditing(true)}
                >
                    <View className="flex-row items-center gap-2">
                        <Image
                            source={icons.edit_note}
                            className="size-6"
                            style={[{ tintColor: '#fff' }]}
                        />
                        <Text className="text-white font-dmsans-bold text-xl">Düzenle</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    return <Text className="font-dmsans-black text-4xl text-red-600">Tarih bilgisi bulunamadı</Text>;
};

export default ObjectiveDetail;