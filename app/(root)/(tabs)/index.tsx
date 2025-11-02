import { Text, View, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView } from "react-native";
import images from "@/constants/images";
import icons from "@/constants/icons";

import { LargeCard, SmallCard } from "@/components/C_Card";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="p-1 h-full" style={{ backgroundColor: '#292524' }} >
        <FlatList
            data={[{name: 1, LargeCard: false}, {name: 2, LargeCard: true}, {name: 3, LargeCard: false}, {name: 4, LargeCard: true}, {name: 5, LargeCard: true}]}
            numColumns={2}
            renderItem={({ item }) => (
                item.LargeCard ?
                    <LargeCard title={`Card ${ item.name }`} />
                    :
                    <SmallCard title={`Card ${ item.name }`} />
            )}
            columnWrapperClassName="flex-wrap gap-2 px-2"
            contentContainerClassName="pt-8 pb-32"
            showsVerticalScrollIndicator={false}
        />
    </SafeAreaView>
  );
}