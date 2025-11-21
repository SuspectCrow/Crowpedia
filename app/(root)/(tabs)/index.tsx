import {Text, View, Image, TouchableOpacity, Animated, Linking, Alert, RefreshControl} from "react-native";
import icons from "@/constants/icons";
import { FlashList } from "@shopify/flash-list";

import { LargeCard, SmallCard } from "@/components/C_Card";
import { SafeAreaView } from "react-native-safe-area-context";
import {useCallback, useState} from "react";
import ScrollView = Animated.ScrollView;
import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { useAppwrite } from "@/lib/useAppwrite";
import {getCards, getCardById, updateCard} from "@/lib/appwrite";
import C_NavBar from "@/components/C_NavBar";
import {ICard} from "@/interfaces/ICard";
import CIconButton from "@/components/C_Button";
import htmlToMd from "html-to-md";

export default function Index() {
    const [quickButtonMenuVisibility, setQuickMenuButton] = useState(false);

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
                console.log(activeFolder);
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

    const handleNavBarPressBack = async () => {
        setActiveFolder(null);
    }

  const path = [
      "Home",
      "Work",
      "Projects",
      "Game Development"
  ]

    const [foldersVisibility, setFolderVisibility] = useState(true);
    const [activeFolder, setActiveFolder] = useState<string | null>(null);

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

    const cardList = Array.isArray(dataCards) ? (dataCards as unknown as ICard[]).filter(card => activeFolder && activeFolder != "" ? card.parentFolder == activeFolder : true) : [];
    const folderList = foldersVisibility ? cardList.filter(card => card.type === "Folder") : [];
    const noteList = cardList.filter(card => card.type !== "Folder");

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
        <C_NavBar activePaths={path} OnPressBack={handleNavBarPressBack} />


        <View className="absolute bottom-12 right-4 z-20 flex items-end justify-end gap-2 blur-lg">
            {
                quickButtonMenuVisibility && (
                    <View className="flex-col items-center justify-end gap-3 bg-stone-800 p-2 rounded-lg border-solid border-stone-700/50 border-4">
                        <CIconButton icon={icons.create_new_folder} dimensions={{ w:48, h:48 }} onPress={() => { router.push(`/card/create/${'Folder'}`); } } />
                        <CIconButton icon={icons.add_task} dimensions={{ w:48, h:48 }} onPress={() => { router.push(`/card/create/${'Task'}`); } } />
                        <CIconButton icon={icons.add_alert} dimensions={{ w:48, h:48 }} onPress={() => { router.push(`/card/create/${'Reminder'}`); }} />
                        <CIconButton icon={icons.calendar_add_on} dimensions={{ w:48, h:48 }} onPress={() => { router.push(`/card/create/${'Date'}`); }} />
                        <CIconButton icon={icons.note_add} dimensions={{ w:48, h:48 }} onPress={() => { router.push(`/card/create/${'Note'}`); }} />
                    </View>
                )
            }
            <CIconButton icon={icons.add} onPress={() => { setQuickMenuButton(!quickButtonMenuVisibility) }} />
        </View>

         <ScrollView className="mt-4" refreshControl={
             <RefreshControl
                 refreshing={refreshing}
                 onRefresh={onRefresh}
                 colors={['#000000', '#2c2c2c']}
                 tintColor="#ffffff"
             />
         }>
             <FlashList
                 data={folderList}
                 masonry
                 numColumns={2}
                 renderItem={({ item, index }) => (
                     item.isLarge ?
                         <LargeCard card={item as unknown as ICard} onPress={() => handlePress(item.$id)}/>
                         :
                         <SmallCard card={item as unknown as ICard} onPress={() => handlePress(item.$id)}/>
                 )}
                 keyExtractor={(item) => item.$id}
                 showsVerticalScrollIndicator={false}
                 ListHeaderComponent={
                     <TouchableOpacity className="flex-row items-center justify-center gap-2 w-fit my-4" onPress={() => setFolderVisibility(v => !v)}>
                         <Image source={!foldersVisibility ? icons.arrow_up : icons.arrow_down} className="size-8" style={[{ tintColor: "rgba(255, 255, 255, 0.8)" }]}></Image>
                         <Text className="text-2xl font-dmsans-bold text-stone-400 text-center">Folders</Text>
                     </TouchableOpacity>
                 }
                 style={[{
                     backgroundColor: '#1c1917',
                     borderRadius: 12,
                     marginHorizontal: 6,
                     // marginVertical: 12,
                     marginTop: 12,
                     paddingHorizontal: 6,
                     paddingVertical: 6,
                     borderColor: '#0c0a09',
                     borderWidth: 4,
                 }]}
             />

             <FlashList
                 data={noteList}
                 masonry
                 numColumns={2}
                 renderItem={({ item , index }) => (
                     item.isLarge ?
                         <LargeCard card={item as unknown as ICard} onPress={() => handlePress(item.$id)}/>
                         :
                         <SmallCard card={item as unknown as ICard} onPress={() => handlePress(item.$id)}/>
                 )}
                 keyExtractor={(item) => item.$id}
                 showsVerticalScrollIndicator={false}
                 ListHeaderComponent={
                     <View>
                         <Text className="text-2xl font-dmsans-bold text-stone-400 my-2 text-center">Cards</Text>
                     </View>
                 }
                 style={[{
                     backgroundColor: '#1c1917',
                     borderRadius: 12,
                     marginHorizontal: 6,
                     marginTop: 24,
                     marginBottom: 72,
                     paddingHorizontal: 6,
                     paddingVertical: 6,
                     borderColor: '#0c0a09',
                     borderWidth: 4,
                 }]}
             />
         </ScrollView>

    </SafeAreaView>
  );
}
