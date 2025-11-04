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
import { getLatestCards, getCards } from "@/lib/appwrite";

export default function Index() {
  const cards = [
      { title: 'Yeni Proje Fikirleri ve Geliştirme', isLarge: true, background: images.cardbg2, cardType: "Folder", order: 0 },
      { title: 'Mobil Uygulama Arayüz Tasarımı', isLarge: false, background: "bg-yellow-500", cardType: "Folder", order: 1 },
      { title: 'Günlük Görev Takibi ve Planlama', isLarge: false, background: "bg-indigo-700", cardType: "Folder", order: 2 },
      { title: 'Veri Analizi Raporları İncelemesi', isLarge: true, background: images.cardbg3, cardType: "Folder", order: 3 },
      { title: 'Web Sitesi Performans Optimizasyonu', isLarge: false, background: "bg-pink-600", cardType: "Folder", order: 4 },
      { title: 'Müşteri Geri Bildirimlerinin Değerlendirilmesi', isLarge: false, background: "bg-lime-500", cardType: "Note", order: 5 },
      { title: 'Eğitim Materyalleri Hazırlığı', isLarge: true, background: images.cardbg4, cardType: "Note", order: 6 },
      { title: 'Pazarlama Stratejisi Belirleme', isLarge: false, background: "bg-blue-800", cardType: "Note", order: 7 },
      { title: 'Yeni Özellikler İçin Kod İncelemesi', isLarge: false, background: "bg-teal-500", cardType: "Note", order: 8 },
      { title: 'Ekip Toplantısı Notları', isLarge: true, background: images.cardbg1, cardType: "Note", order: 9 },
      { title: 'Sunum İçin Görsel Materyaller', isLarge: false, background: "bg-orange-600", cardType: "Note", order: 10 },
      { title: 'Kullanıcı Deneyimi Testleri', isLarge: false, background: "bg-emerald-700", cardType: "Note", order: 11 },
      { title: 'Bütçe Planlama ve Kontrol', isLarge: true, background: images.cardbg2, cardType: "Note", order: 12 },
      { title: 'Güvenlik Güncellemeleri Kontrolü', isLarge: false, background: "bg-red-700", cardType: "Note", order: 13 },
      { title: 'Altyapı İyileştirmeleri Çalışması', isLarge: false, background: "bg-gray-700", cardType: "Link", order: 14 }
  ];

  const path = [
      "Home",
      "Work",
      "Projects",
      "Game Development"
  ]

    const [navbarVisibility, setNavbarVisibility] = useState(false);
    const [foldersVisibility, setFolderVisibility] = useState(false);

    const params = useLocalSearchParams<{ query?: string; filter?: string }>();

    const { data: latestProperties, loading: latestPropertiesLoading } =
        useAppwrite({
            fn: getLatestCards,
        });

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

    const handleCardPress = (id: string) => router.push(`/card/${id}`);

    const handlePress = async (type: string) => {
        switch (type) {
            case "Link":
                try {
                    await Linking.openURL("https://www.youtube.com/watch?v=KOSvDlFyg20");
                } catch (error) {
                    Alert.alert(`URL açılamadı: ${"https://www.youtube.com/watch?v=KOSvDlFyg20"}`);
                }
        }
    }

  return (
    <SafeAreaView className="p-1 h-full" style={{ backgroundColor: '#292524' }} >
        <TouchableOpacity className="p-4 mx-2 mt-4 rounded-xl border-solid border-4 border-stone-700/50"  onPress={() => setNavbarVisibility(v => !v)}>
            <View className="flex-row items-center justify-end me-6 overflow-hidden">
                {path.map((item, index) => (
                    <View key={index} className="flex-row items-center">
                        <Text className={`${ index == path.length - 1 ? 'text-stone-400' : 'text-stone-600' } font-dmsans-bold text-lg`}>
                            { item }
                        </Text>

                        {index < path.length - 1 && (
                            <Image source={icons.arrow_forward} className="size-6 mx-2" style={[{ tintColor: '#78716c' }]} />
                        )}
                    </View>
                ))}
            </View>
        </TouchableOpacity>

        {
            navbarVisibility && (
                <View className="p-4 rounded-xl border-solid border-4 bg-stone-900 border-stone-700/50">
                    <TouchableOpacity className="p-3 rounded-xl border-solid border-4 bg-stone-700 border-stone-900/50">
                        <View className="flex-row items-center justify-center">
                            <Image source={icons.arrow_left} className="size-6 mx-2" />
                            <Text className="font-dmsans-bold text-lg text-white">Back</Text>
                        </View>
                    </TouchableOpacity>
                    <View className="flex-col items-start justify-start gap-2 mt-4">
                        {path.map((item, index) => (
                            <TouchableOpacity key={index} className="flex-row items-center  w-full" disabled={ index == path.length - 1 }>
                                { index == path.length - 1 && (
                                    <Image source={icons.arrow_forward} className="size-6" style={[{ tintColor: '#fff' }]} />
                                )}
                                <Image source={icons.folder} className="size-7 mx-2" style={[{ tintColor: `${index == path.length -1 ? '#fff' : '#78716c'}` }]} />
                                <Text className={`${ index == path.length - 1 ? 'text-stone-300 font-dmsans-bold' : 'text-stone-600 font-dmsans-medium' } text-xl`}>
                                    { item }
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )
        }

         <ScrollView className="mt-4">
             <FlashList
                 data={!foldersVisibility ? (cardsData || []).filter(card => card.type == "Folder").sort((a, b) => a.order - b.order) : []}
                 masonry
                 numColumns={2}
                 renderItem={({ item, index }) => (
                     item.isLarge ?
                         <LargeCard index={index} order={item.order} title={item.title} isLarge={item.isLarge} background={item.background} cardType={item.type} onPress={() => handleCardPress(item.$id)}/>
                         :
                         <SmallCard index={index} order={item.order} title={item.title} isLarge={item.isLarge} background={item.background} cardType={item.type} onPress={() => handleCardPress(item.$id)}/>
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
                 data={(cardsData || []).sort((a, b) => a.order - b.order).filter(card => card.type != "Folder")}
                 masonry
                 numColumns={2}
                 renderItem={({ item, index }) => (
                     item.isLarge ?
                         <LargeCard index={index} order={item.order} title={item.title} isLarge={item.isLarge} background={item.background} cardType={item.type} onPress={() => handleCardPress(item.$id)}/>
                         :
                         <SmallCard index={index} order={item.order} title={item.title} isLarge={item.isLarge} background={item.background} cardType={item.type} onPress={() => handlePress(item.type)}/>
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