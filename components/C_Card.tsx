import { Image, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import images from "@/constants/images";
import icons from "@/constants/icons";

interface Props {
    onPress?: () => void;
    title: string;
    columns?: number; // kaç sütun kullanılacağı
}

export const LargeCard = ({ title, onPress, columns = 2 }: Props) => {
    const { width } = useWindowDimensions();
    const gap = 12; // gap-3 ~ 12px
    const containerPadding = 12; // FlatList tarafında kullandığımız paddingHorizontal ile eşleşmeli
    const cardWidth = (width - containerPadding * 2 - gap * (columns - 1)) / columns;
    return (
        <TouchableOpacity className="w-1/2 gap-3 mb-2 relative h-72 rounded-xl border-solid border-stone-700/50 border-4">
            <Image source={images.cardbg2} className="size-full rounded-xl"  />
            <View className="absolute bottom-3 left-3 flex flex-row justify-start items-center gap-2">
                <Image source={icons.folder} className="w-8 h-8 size-full" style={[{ tintColor: '#fff' }]} />
                <Text className="font-dmsans-bold text-lg text-stone-100">{ title }</Text>
            </View>
        </TouchableOpacity>
    )
};

export const SmallCard = ({ title, onPress }: Props) => {
    return (
        <TouchableOpacity className="flex-row w-1/2 mb-2 col-start-2 justify-start items-center gap-2 p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-red-600">
            <Image source={icons.folder} className="w-8 h-8" />
            <Text className="font-dmsans-bold text-lg text-stone-100">{ title }</Text>
        </TouchableOpacity>
    )
};