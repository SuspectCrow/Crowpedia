import {Text, View, TouchableOpacity, Alert, RefreshControl, ScrollView, Linking} from "react-native";
import { FlashList } from "@shopify/flash-list";

import { LargeCard, SmallCard } from "@/components/C_Card";
import { SafeAreaView } from "react-native-safe-area-context";
import {useCallback, useState} from "react";
import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { useAppwrite } from "@/lib/useAppwrite";
import {getCards, getCardById, updateCard} from "@/lib/appwrite";
import C_NavBar from "@/components/C_NavBar";
import {ICard} from "@/interfaces/ICard";
import CIconButton from "@/components/C_Button";
import {MaterialIcons} from "@expo/vector-icons";
import {CardTypeWrapper} from "@/components/C_CardTypeWrapper";

// Türlerin gösterim sırası
const TYPE_ORDER = ['Event', 'Objective', 'TaskList', 'SimpleTask', 'Note', 'Link', 'Collection', 'Routine'];

export default function Index() {
    const [quickButtonMenuVisibility, setQuickMenuButton] = useState(false);
    const [activeFolder, setActiveFolder] = useState<string | null>(null);
    const [folderPath, setFolderPath] = useState<Array<{id: string | null, name: string}>>([
        { id: null, name: "HOME" }
    ]);

    const handlePress = async (id: string) => {
        const Card = await getCardById(id) as unknown as ICard;

        if (!Card) return undefined;

        switch (Card.type) {
            case "Link":
                try {
                    await Linking.openURL(Card.content);
                } catch (error) {
                    Alert.alert(`URL açılamadı: ${Card.content}`);
                }
                break;
            case "Note":
                router.push(`/card/detail/${id}`);
                break;

            case "Folder":
                setActiveFolder(Card.$id as string);
                setFolderPath(prev => [...prev, { id: Card.$id, name: Card.title || "Untitled" }]);
                break;

            case "SimpleTask":
                try {
                    await updateCard(Card.$id, { content: String(!(Card.content === "true")) });
                    Card.content = String(!(Card.content === "true"));
                    onRefresh();
                } catch (error) {
                    console.error("Kaydetme hatası:", error);
                }
                break;

            default:
                router.push(`/card/detail/${id}`);
                break;
        }
    }

    const handleLongPress = async (id: string) => {
        const Card = await getCardById(id) as unknown as ICard;

        if (!Card) return undefined;

        router.push(`/card/detail/${id}`);
    }

    const handleNavBarPressBack = async () => {
        if (folderPath.length > 1) {
            const newPath = [...folderPath];
            newPath.pop();
            const previousFolder = newPath[newPath.length - 1];

            setFolderPath(newPath);
            setActiveFolder(previousFolder.id);
        }
    }

    const params = useLocalSearchParams<{ query?: string; filter?: string }>();

    const { data: dataCards, refetch: refetchCards, loading: loadingCards} =
        useAppwrite({
            fn: getCards,
            params: {filter: params.filter!, query: params.query!, limit: 6,},
            skip: true,
        });

    useEffect(() => {
        refetchCards({filter: params.filter!, query: params.query!, limit: 32,});
    }, [params.filter, params.query]);

    const cardList = Array.isArray(dataCards)
        ? (dataCards as unknown as ICard[]).filter(card => {
            return card.parentFolder == activeFolder;
        })
        : [];

    const folderList = cardList.filter(card => card.type === "Folder");
    const allCards = cardList.filter(card => card.type != "Folder");

    // Kartları türlerine göre grupla
    const cardsByType = allCards.reduce((acc, card) => {
        const type = card.type || 'Other';
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(card);
        return acc;
    }, {} as Record<string, ICard[]>);

    // Türleri sıralı olarak diziye çevir (TYPE_ORDER'a göre)
    const sortedTypes = TYPE_ORDER.filter(type => cardsByType[type] && cardsByType[type].length > 0);

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await refetchCards({
                filter: params.filter!,
                query: params.query!,
                limit: 32,
            });
        } catch (error) {
            console.error("Yenileme sırasında hata oluştu:", error);
        } finally {
            setRefreshing(false);
        }
    }, [refetchCards, params]);

    return (
        <SafeAreaView className="p-1 h-full relative" style={{ backgroundColor: '#292524' }} >
            <C_NavBar
                activePaths={folderPath.map(f => f.name)}
                OnPressBack={folderPath.length > 1 ? handleNavBarPressBack : undefined}
            />

            <View className="absolute bottom-12 right-4 z-20 flex items-end justify-end gap-2 blur-lg">
                {
                    quickButtonMenuVisibility && (
                        <View className="flex-col items-center justify-end gap-3 bg-stone-800 p-2 rounded-lg border-solid border-stone-700/50 border-4">
                            <CIconButton icon='create-new-folder' dimensions={{ w:48, h:48 }} onPress={() => { router.push(`/card/create/${'Folder'}`); }} />
                            <CIconButton icon='collections-bookmark' dimensions={{ w:48, h:48 }} onPress={() => { router.push(`/card/create/${'Collection'}`); }} />
                            <CIconButton icon='add-task' dimensions={{ w:48, h:48 }} onPress={() => { router.push(`/card/create/${'SimpleTask'}`); }} />
                            <CIconButton icon='insert-chart-outlined' dimensions={{ w:48, h:48 }} onPress={() => { router.push(`/card/create/${'Objective'}`); }} />
                            <CIconButton icon='add-link' dimensions={{ w:48, h:48 }} onPress={() => { router.push(`/card/create/${'Link'}`); }} />
                            <CIconButton icon='event' dimensions={{ w:48, h:48 }} onPress={() => { router.push(`/card/create/${'Event'}`); }} />
                            <CIconButton icon='checklist' dimensions={{ w:48, h:48 }} onPress={() => { router.push(`/card/create/${'TaskList'}`); }} />
                            <CIconButton icon='note-add' dimensions={{ w:48, h:48 }} onPress={() => { router.push(`/card/create/${'Note'}`); }} />
                        </View>
                    )
                }
                <CIconButton icon={"add"} onPress={() => { setQuickMenuButton(!quickButtonMenuVisibility) }} />
            </View>

            <ScrollView
                className="mt-2 mb-2"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#000000', '#2c2c2c']}
                        tintColor="#ffffff"
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Folders Section */}
                {folderList.length > 0 && (
                    <CardTypeWrapper
                        type="Folder"
                        cards={folderList}
                        onCardPress={handlePress}
                        onCardLongPress={handleLongPress}
                        defaultExpanded={true}
                    />
                )}

                {/* Cards Grouped by Type */}
                {sortedTypes.map(type => (
                    <CardTypeWrapper
                        key={type}
                        type={type}
                        cards={cardsByType[type]}
                        onCardPress={handlePress}
                        onCardLongPress={handleLongPress}
                        defaultExpanded={true}
                    />
                ))}

                {/* Empty State */}
                {folderList.length === 0 && sortedTypes.length === 0 && (
                    <View className="flex-1 items-center justify-center p-8 mt-20">
                        <MaterialIcons name="inbox" size={64} color="#57534e" />
                        <Text className="text-stone-500 font-dmsans-medium text-lg mt-4 text-center">
                            Bu klasörde henüz içerik yok
                        </Text>
                        <Text className="text-stone-600 font-dmsans-regular text-sm mt-2 text-center">
                            Sağ alttaki + butonuna tıklayarak yeni kart ekleyin
                        </Text>
                    </View>
                )}
            </ScrollView>

        </SafeAreaView>
    );
}