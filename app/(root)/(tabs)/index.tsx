import { Text, View, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView } from "react-native";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { FlashList } from "@shopify/flash-list";

import { LargeCard, SmallCard } from "@/components/C_Card";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const cards = [
      { title: 'Yeni Proje Fikirleri ve Geliştirme', LargeCard: true, BG: images.cardbg2, isFolderCard: true },
      { title: 'Mobil Uygulama Arayüz Tasarımı', LargeCard: false, BG: "bg-yellow-500", isFolderCard: true },
      { title: 'Günlük Görev Takibi ve Planlama', LargeCard: false, BG: "bg-indigo-700", isFolderCard: true },
      { title: 'Veri Analizi Raporları İncelemesi', LargeCard: true, BG: images.cardbg3, isFolderCard: true },
      { title: 'Web Sitesi Performans Optimizasyonu', LargeCard: false, BG: "bg-pink-600", isFolderCard: true },
      { title: 'Müşteri Geri Bildirimlerinin Değerlendirilmesi', LargeCard: false, BG: "bg-lime-500", isFolderCard: true },
      { title: 'Eğitim Materyalleri Hazırlığı', LargeCard: true, BG: images.cardbg4, isFolderCard: true },
      { title: 'Pazarlama Stratejisi Belirleme', LargeCard: false, BG: "bg-blue-800", isFolderCard: true },
      { title: 'Yeni Özellikler İçin Kod İncelemesi', LargeCard: false, BG: "bg-teal-500", isFolderCard: true },
      { title: 'Ekip Toplantısı Notları', LargeCard: true, BG: images.cardbg1, isFolderCard: true },
      { title: 'Sunum İçin Görsel Materyaller', LargeCard: false, BG: "bg-orange-600", isFolderCard: true },
      { title: 'Kullanıcı Deneyimi Testleri', LargeCard: false, BG: "bg-emerald-700", isFolderCard: false },
      { title: 'Bütçe Planlama ve Kontrol', LargeCard: true, BG: images.cardbg2, isFolderCard: false },
      { title: 'Güvenlik Güncellemeleri Kontrolü', LargeCard: false, BG: "bg-red-700", isFolderCard: false },
      { title: 'Altyapı İyileştirmeleri Çalışması', LargeCard: false, BG: "bg-gray-700", isFolderCard: false }
  ];

  const path = [
      "Home",
      "Work",
      "Projects",
      "Game Development"
  ]

  return (
    <SafeAreaView className="p-1 h-full" style={{ backgroundColor: '#292524' }} >
        <TouchableOpacity className="p-4 mt-4 rounded-xl border-solid border-4 border-stone-700/50">
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

        <FlashList
            data={cards}
            masonry
            numColumns={2}
            renderItem={({ item }) => (
                item.LargeCard ?
                    <LargeCard title={ item.title } isFolderCard={item.isFolderCard} background={item.BG} />
                    :
                    <SmallCard title={ item.title } isFolderCard={item.isFolderCard} background={ item.BG } />
            )}
            contentContainerClassName="pt-2 pb-32"
            showsVerticalScrollIndicator={false}
        />
    </SafeAreaView>
  );
}