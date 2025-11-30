import {ICard} from "@/interfaces/ICard";
import {Text, View} from "react-native";

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

const EventDetail = ({ card, parsedCardContent }: { card: ICard, parsedCardContent: any }) => {
    const raw = parsedCardContent?.timestamp ?? card.content ?? '';
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
                    <Text className="font-dmsans-light text-xl text-stone-500">{ parsedCardContent?.location ?? '' }</Text>
                </View>
                <View className="flex-row items-center justify-start gap-4">
                    <Text className="font-dmsans-medium text-md text-stone-500">{formattedDate}</Text>
                    <Text className="font-dmsans-bold text-md text-stone-500">{formattedTime}</Text>
                </View>
                <View>
                    <Text className="font-dmsans-regular text-xl text-stone-200 text-center">{ parsedCardContent?.description ?? '' }</Text>
                </View>
            </View>
        )
    }
    return <Text className="font-dmsans-black text-4xl text-red-600">{String(raw)}</Text>
};

export default EventDetail;