import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import images from "@/constants/images";
import {ICard} from "@/interfaces/ICard";
import {getCardIcon} from "@/constants/card_info";
import Index from "@/app/(root)/(tabs)";

export type CardStyle = {
    iconClass?: string;
    textClass?: string;
    iconStyle? : any;
};

const CardStyleMap: Record<string, CardStyle> = {
    Default: {
        iconClass: "w-8 h-8",
        textClass: "font-dmsans-medium text-base text-red-600"
    },
    Folder: {
        iconClass: "w-8 h-8",
        textClass: "font-dmsans-medium text-base text-red-600"
    },
    Note: {
        iconClass: "w-8 h-8",
        textClass: "font-dmsans-light text-base"
    },
    Link: {
        iconClass: "w-8 h-8",
        textClass: "font-dmsans-medium text-base !text-cyan-500 underline",
        iconStyle: {
            tintColor: "#06b6d4",
        }
    }
}

export const getCardStyle = (type: string | undefined): CardStyle => {
    return CardStyleMap[type as keyof typeof CardStyleMap] || CardStyleMap.Default;
}

const borderRadius = "rounded-lg";

export const LargeCard = ({ title, cardType, isFavorite, isLarge, background, index, order, onPress }: ICard) => {
    const CardStyle = getCardStyle(cardType);

    return (
        <TouchableOpacity className={`gap-3 m-1 relative h-72 ${borderRadius} border-solid border-stone-700/50 border-4`}>
            <Image source={background} className={`size-full ${borderRadius}`} />
            <Image source={images.largecardgradient} className={`absolute bottom-0 left-0 size-full ${borderRadius}`} style={{ zIndex: 1 }} />
            <View className="absolute bottom-3 left-3 flex flex-row justify-start items-end gap-2 max-w-[75%]" style={{ zIndex: 2 }}>
                <Image source={ getCardIcon(cardType) } className={ `${ CardStyle.iconClass }` } style={[{ tintColor: '#ffffff80' }, CardStyle.iconStyle]} />
                <Text className={`${ getCardStyle(cardType).textClass } text-stone-100/80 max-w-[80%]`}>{ title }</Text>
            </View>
            <Text className="absolute top-2 right-2 bg-white p-2 rounded-full text-center text-md font-dmsans-bold">{ index + " | " + order}</Text>
        </TouchableOpacity>
    )
};

export const SmallCard = ({ title, cardType, isFavorite, isLarge, background, index, order, onPress }: ICard) => {
    const CardStyle = getCardStyle(cardType);

    return (
        <TouchableOpacity className={`flex-row m-1 justify-start items-start gap-2 p-3 ${borderRadius} border-solid border-4 border-stone-700/50 ${ background }`}>
            <Image source={ getCardIcon(cardType) } className={ `${ CardStyle.iconClass }` } style={[{ tintColor: '#ffffff80' }, CardStyle.iconStyle]} />
            <Text className={`${ getCardStyle(cardType).textClass } text-stone-100/80 max-w-[80%]`}>{ title }</Text>
            <Text className="absolute top-2 right-2 bg-white p-2 rounded-full text-center text-md font-dmsans-bold">{ index + " | " + order}</Text>
        </TouchableOpacity>
    )
};