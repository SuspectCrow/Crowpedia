import {ICard} from "@/interfaces/ICard";
import {Text, View} from "react-native";
import React from "react";

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

const ObjectiveDetail = ({ card, parsedCardContent }: { card: ICard, parsedCardContent: any }) => {
    const stRaw = parsedCardContent?.startdate ?? null;
    const etRaw = parsedCardContent?.enddate ?? null;
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
                    <Text className="font-dmsans-regular text-xl text-stone-200 text-center">{ parsedCardContent?.description ?? '' }</Text>
                </View>
            </View>
        )
    }
    return <Text className="font-dmsans-black text-4xl text-red-600">Tarih bilgisi bulunamadı</Text>
};

export default ObjectiveDetail;