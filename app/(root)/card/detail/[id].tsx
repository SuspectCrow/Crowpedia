import {
    View, Text, TouchableOpacity, Image, ScrollView, Alert
} from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import {router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {getCardById, updateCard} from "@/lib/appwrite";
import {ICard} from "@/interfaces/ICard";
import icons from "@/constants/icons";
import colors from "tailwindcss/colors";
import {getCardIcon} from "@/constants/card_info";

import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import showdown from 'showdown';
import htmlToMd from 'html-to-md';

const converter = new showdown.Converter();
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
const formatTRWeekDate = (d: Date) =>
    new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ }).format(d);
const formatTRTime = (d: Date) =>
    new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).format(d);
const daysUntil = (target: Date, from: Date = new Date()): number => {
    const fromStart = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const diff = Math.ceil((targetStart.getTime() - fromStart.getTime()) / 86400000);
    return Math.max(0, diff);
};



const EventDetail = ({ card, parsed }: { card: ICard, parsed: any }) => {
    const raw = parsed?.timestamp ?? card.content ?? '';
    const d = toDate(raw);
    if (d) {
        const formattedDate = formatTRWeekDate(d);
        const formattedTime = formatTRTime(d);
        return (
            <View className="flex-col items-center justify-start gap-4">
                <View>
                    <Text className="font-dmsans-bold text-4xl text-stone-300 text-center">{ card.title }</Text>
                </View>
                <View className="flex-row items-center justify-start gap-2">
                    <Text className="font-dmsans-light text-xl text-stone-500">{ parsed?.location ?? '' }</Text>
                </View>
                <View className="flex-row items-center justify-start gap-4">
                    <Text className="font-dmsans-medium text-md text-stone-500">{formattedDate}</Text>
                    <Text className="font-dmsans-bold text-md text-stone-500">{formattedTime}</Text>
                </View>
                <View>
                    <Text className="font-dmsans-regular text-xl text-stone-200 text-center">{ parsed?.description ?? '' }</Text>
                </View>
            </View>
        )
    }
    return <Text className="font-dmsans-black text-4xl text-red-600">{String(raw)}</Text>
};

const ObjectiveDetail = ({ card, parsed }: { card: ICard, parsed: any }) => {
    const stRaw = parsed?.startdate ?? null;
    const etRaw = parsed?.enddate ?? null;
    const sd = toDate(stRaw);
    const ed = toDate(etRaw);

    if (sd || ed) {
        const formattedStartDate = sd ? formatTRDate(sd) : '-';
        const formattedEndDate = ed ? formatTRDate(ed) : '-';
        const startLeftDays = sd ? daysUntil(sd) : null;
        const endLeftDays = ed ? daysUntil(ed) : null;

        return (
            <View className="flex-col items-center justify-start gap-4">
                <View>
                    <Text className="font-dmsans-bold text-4xl text-stone-300 text-center">{ card.title }</Text>
                </View>
                <View className="flex-row items-center justify-start gap-4">
                    <Text className="font-dmsans-medium text-md text-red-500">{formattedStartDate}</Text>
                    <Text className="font-dmsans-black text-md text-stone-200">{ "->" }</Text>
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
                    <Text className="font-dmsans-regular text-xl text-stone-200 text-center">{ parsed?.description ?? '' }</Text>
                </View>
            </View>
        )
    }
    return <Text className="font-dmsans-black text-4xl text-red-600">Tarih bilgisi bulunamadı</Text>
};

const NoteEditor = ({ card }: { card: ICard }) => {
    const richText = useRef<RichEditor>(null);
    const initialHtml = converter.makeHtml(card.content ?? '');
    const [editedHtml, setEditedHtml] = useState(initialHtml);

    const handleSave = async () => {
        if (!card.$id) return;

        const markdownContent = htmlToMd(editedHtml);

        if (markdownContent === card.content) {
            Alert.alert("Değişiklik Yok", "Herhangi bir değişiklik yapmadınız.");
            return;
        }

        try {
            await updateCard(card.$id, { content: markdownContent });
            Alert.alert("Başarılı", "Notunuz güncellendi.");
        } catch (error) {
            console.error("Kaydetme hatası:", error);
            Alert.alert("Hata", "Not kaydedilirken bir sorun oluştu.");
        }
    };

    return (
        <View className="flex-1">

            <RichToolbar
                editor={richText}
                actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.heading1,
                    actions.heading2,
                    actions.heading3,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                    actions.undo,
                    actions.redo
                ]}
                style={{
                    backgroundColor: '#1c1917',
                    borderColor: colors.stone[700],
                    borderWidth: 2,
                    borderRadius: 12,
                }}
                selectedIconTint={colors.sky[400]}
                iconTint={colors.stone[400]}
            />

            <ScrollView className="flex-1 mt-4">
                <RichEditor
                    ref={richText}
                    initialContentHTML={initialHtml}
                    onChange={setEditedHtml}
                    placeholder="Notunuzu buraya yazın..."
                    containerStyle={{
                        backgroundColor: '#1c1917',
                        borderRadius: 12,
                        borderColor: colors.stone[700] + '80',
                        borderWidth: 4,
                        minHeight: 300,
                    }}
                    editorStyle={{
                        backgroundColor: '#1c1917',
                        color: '#d6d3d1',
                        placeholderColor: colors.stone[600],
                        cssText: `
                            font-family: 'DMSans-Regular', sans-serif;
                            font-size: 16px;
                            line-height: 1.5;
                        `
                    }}
                />
            </ScrollView>

            <TouchableOpacity
                className="bg-stone-600 p-4 rounded-xl border-solid border-stone-700/50 border-4 mt-4"
                onPress={handleSave}
            >
                <Text className="text-white font-dmsans-bold text-lg text-center">Kaydet</Text>
            </TouchableOpacity>
        </View>
    );
}

const CardDetailContent = ({ card }: { card: ICard | null }) => {
    if (!card) {
        return (
            <Text className="font-dmsans-black text-4xl text-red-600">
                404 - Not Found
            </Text>
        )
    }

    let parsed: any;
    try {
        parsed = JSON.parse(card.content ?? '{}')
    } catch {
        parsed = {};
    }

    switch (card.type) {
        case "Event":
            return <EventDetail card={card} parsed={parsed} />;
        case "Objective":
            return <ObjectiveDetail card={card} parsed={parsed} />;
        case "Note":
            return <NoteEditor card={card} />;
        default:
            return (
                <Text className="font-dmsans-black text-4xl text-red-600">
                    {card.content ?? 'Bulunamadı'}
                </Text>
            );
    }
};

const Property = () => {
    const { id } = useLocalSearchParams<{ id?: string }>()
    const [card, setCard] = useState<ICard | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let mounted = true
        async function load() {
            if (!id) return
            setLoading(true)
            const res = await getCardById(id as string)
            if (mounted) setCard(res as unknown as ICard | null)
            setLoading(false)
        }
        load()
        return () => { mounted = false }
    }, [id]);

    return (
        <SafeAreaView className="py-5 px-4 h-full relative" style={[{ backgroundColor: '#292524' }]}>
            <View className="flex-row w-full items-center gap-2 pb-4">
                <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 p-3 mt-4 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900" onPress={() => { router.back(); }}>
                    <Image source={icons.arrow_left} className="size-8" style={[{ tintColor: `${ colors.stone['400'] }` }]} />
                    <Text className={"text-stone-400 font-dmsans-bold text-xl"}>Back</Text>
                </TouchableOpacity>
                <View className="flex-2 flex-row items-center justify-start gap-2 p-3 mt-4 w-2/3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-600">
                    <Image source={getCardIcon(card ? card!.type : "Event")} className="size-8" style={[{ tintColor: `${ colors.stone['800'] }` }]} />
                    <Text className="text-stone-900 font-dmsans-bold text-lg">
                        { card ? card.type : "NULL" }
                    </Text>
                </View>
            </View>

            <View className="flex-1">
                {loading ? (
                    <Text className="text-white text-center">Yükleniyor...</Text>
                ) : (
                    <CardDetailContent card={card} />
                )}
            </View>
        </SafeAreaView>
    )
}
export default Property;