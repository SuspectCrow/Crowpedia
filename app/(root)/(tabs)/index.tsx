import {Text, View, Image, TouchableOpacity, StyleSheet, Animated, Linking, Alert} from "react-native";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { FlashList } from "@shopify/flash-list";

import { LargeCard, SmallCard } from "@/components/C_Card";
import { SafeAreaView } from "react-native-safe-area-context";
import {useState} from "react";
import ScrollView = Animated.ScrollView;
import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { useAppwrite } from "@/lib/useAppwrite";
import { getCards, getCardById, getFolders } from "@/lib/appwrite";
import C_NavBar from "@/components/C_NavBar";
import {ICard} from "@/interfaces/ICard";
import {json} from "node:stream/consumers";

export default function Index() {
  const path = [
      "Home",
      "Work",
      "Projects",
      "Game Development"
  ]
    const [foldersVisibility, setFolderVisibility] = useState(false);
    const [activeFolder, setActiveFolder] = useState<string | null>(null);

    const params = useLocalSearchParams<{ query?: string; filter?: string }>();

    // const { data: latestProperties, loading: latestPropertiesLoading } =
    //     useAppwrite({
    //         fn: getLatestCards,
    //     });

    const {
        data: cardsData,
        refetch,
        loading,
    } = useAppwrite({
        fn: getCards,
        params: {
            filter: params.filter!,
            query: params.query!,
            limit: 6,
        },
        skip: true,
    });

    useEffect(() => {
        refetch({
            filter: params.filter!,
            query: params.query!,
            limit: 6,
        });
    }, [params.filter, params.query]);

    const handlePress = async (id: string) => {

        const Card = await getCardById(id) as unknown as ICard;

        if (!Card) return undefined;

        switch (Card.type) {
            case "Link":
                try {
                    await Linking.openURL("https://www.youtube.com/watch?v=KOSvDlFyg20");
                } catch (error) {
                    Alert.alert(`URL açılamadı: ${"https://www.youtube.com/watch?v=KOSvDlFyg20"}`);
                }
                break;
            case "Note":
                router.push(`/card/${id}`);
                break;

            default:
                router.push(`/card/${id}`);
                break;
        }
    }

    // console.log(JSON.stringify(cardsData), null, 2);

    const cardList = Array.isArray(cardsData) ? (cardsData as unknown as ICard[]) : [];
    const folderCards = !foldersVisibility ? cardList.filter(card => card.type === "Folder").sort((a, b) => a.order - b.order) : [];
    const noteCards = cardList.filter(card => card.type !== "Folder").sort((a, b) => a.order - b.order);

  return (
    <SafeAreaView className="p-1 h-full" style={{ backgroundColor: '#292524' }} >
        <C_NavBar activePaths={path} />

         <ScrollView className="mt-4">
             <FlashList
                 data={folderCards}
                 masonry
                 numColumns={2}
                 renderItem={({ item, index }) => (
                     item.isLarge ?
                         <LargeCard item={item} onPress={() => handlePress(item.$id)}/>
                         :
                         <SmallCard item={item} onPress={() => handlePress(item.$id)}/>
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
                 data={noteCards}
                 masonry
                 numColumns={2}
                 renderItem={({ item , index }) => (
                     item.isLarge ?
                         <LargeCard item={item} onPress={() => handlePress(item.$id)}/>
                         :
                         <SmallCard item={item} onPress={() => handlePress(item.$id)}/>
                 )}
                 keyExtractor={(item) => item.$id}
                 showsVerticalScrollIndicator={false}
                 ListHeaderComponent={
                     <View>
                         <Text className="text-2xl font-dmsans-bold text-stone-400 my-2 text-center">Notes</Text>
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
