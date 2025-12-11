import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView, Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useCallback, useEffect, useState} from 'react'
import {router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {getCardById} from "@/lib/appwrite";
import {ICard} from "@/interfaces/ICard";
import colors from "tailwindcss/colors";
import {getCardIcon} from "@/constants/card_info";

import TaskListDetail from "@/app/(root)/card/detail/Sections/TaskListDetail";
import NoteDetail from "@/app/(root)/card/detail/Sections/NoteDetail";
import ObjectiveDetail from "@/app/(root)/card/detail/Sections/ObjectiveDetail";
import EventDetail from "@/app/(root)/card/detail/Sections/EventDetail";
import LinkDetail from "./Sections/LinkDetail";
import SimpleTaskDetail from "@/app/(root)/card/detail/Sections/SimpleTaskDetail";
import CollectionDetail from "@/app/(root)/card/detail/Sections/CollectionDetail";
import {MaterialIcons} from "@expo/vector-icons";


const CardDetailContent = ({ card, onRefresh }: { card: ICard | null, onRefresh: () => void }) => {
    if (!card) {
        return (
            <Text className="font-dmsans-black text-4xl text-red-600">
                404 - Not Found
            </Text>
        )
    }

    let parsedCardContent: any;
    try {
        parsedCardContent = JSON.parse(card.content ?? '{}')
    } catch {
        parsedCardContent = {};
    }

    switch (card.type) {
        case "Event":
            return <EventDetail card={card} parsedCardContent={parsedCardContent} onRefresh={onRefresh} />;
        case "Objective":
            return <ObjectiveDetail card={card} parsedCardContent={parsedCardContent} onRefresh={onRefresh} />;
        case "Note":
            return <NoteDetail card={card} />;
        case "TaskList":
            return <TaskListDetail card={card} onRefresh={onRefresh} />;
        case "Link":
            return <LinkDetail card={card} onRefresh={onRefresh} />;
        case "SimpleTask":
            return <SimpleTaskDetail card={card} onRefresh={onRefresh} />;
        case "Collection":
            return <CollectionDetail card={card} parsedCardContent={parsedCardContent} onRefresh={onRefresh} />
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

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
        if (!id) return;

        setRefreshing(true);
        try {
            const res = await getCardById(id as string);
            setCard(res as unknown as ICard | null);
        } catch (error) {
            console.error("Yenileme sırasında hata oluştu:", error);
        } finally {
            setRefreshing(false);
        }
    }, [id]);

    return (
        <SafeAreaView className="py-5 px-4 h-full relative" style={[{ backgroundColor: '#292524' }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[{ flex: 1 }]}
            >
                <View className="flex-row w-full items-center gap-2 pb-4">
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 p-3 mt-4 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900" onPress={() => { router.back(); }}>
                        <MaterialIcons name={"arrow-left"} size={24} style={{ color: colors.stone['400'] }}/>
                        <Text className={"text-stone-400 font-dmsans-bold text-xl"}>Back</Text>
                    </TouchableOpacity>
                    <View className="flex-2 flex-row items-center justify-start gap-2 p-3 mt-4 w-2/3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-600">
                        <MaterialIcons name={card ? getCardIcon(card!.type) : "note"} size={24} style={{ color: colors.stone['800'] }}/>
                        <Text className="text-stone-900 font-dmsans-bold text-lg">
                            { card ? card.title : "NULL" }
                        </Text>
                    </View>
                </View>

                <View className="flex-1">
                    {loading ? (
                        <Text className="text-white text-center">Yükleniyor...</Text>
                    ) : (
                        <CardDetailContent card={card} onRefresh={onRefresh}/>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
export default Property;