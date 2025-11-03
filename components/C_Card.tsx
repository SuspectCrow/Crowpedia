import {Image, Text, TouchableOpacity, View} from "react-native";
import images from "@/constants/images";
import {ICard} from "@/interfaces/ICard";
import {getCardIcon} from "@/constants/card_info";

export type CardStyle = {
    iconClass?: string;
    textClass?: string;
    iconStyle? : any;
};

const CardStyleMap: Record<string, CardStyle> = {
    Default: {
        iconClass: "w-8 h-8",
        textClass: "font-dmsans-bold text-lg text-red-600"
    },
    Folder: {
        iconClass: "w-8 h-8",
        textClass: "font-dmsans-bold text-lg text-red-600"
    },
    Note: {
        iconClass: "w-8 h-8",
        textClass: "font-dmsans-light text-sm"
    },
    Link: {
        iconClass: "w-8 h-8",
        textClass: "font-dmsans-bold text-lg !text-cyan-500 underline",
        iconStyle: {
            tintColor: "#06b6d4",
        }
    }
}

export const getCardStyle = (type: string | undefined): CardStyle => {
    return CardStyleMap[type as keyof typeof CardStyleMap] || CardStyleMap.Default;
}

export const LargeCard = ({ title, cardType, isFavorite, isLarge, background, onPress }: ICard) => {
    const CardStyle = getCardStyle(cardType);

    return (
        <TouchableOpacity className={`gap-3 m-1 relative h-72 rounded-xl border-solid border-stone-700/50 border-4`}>
            <Image source={background} className="size-full rounded-xl"  />
            <Image source={images.largecardgradient} className="absolute bottom-0 left-0 size-full rounded-xl" style={{ zIndex: 1 }} />
            <View className="absolute bottom-3 left-3 flex flex-row justify-start items-end gap-2 max-w-[75%]" style={{ zIndex: 2 }}>
                <Image source={ getCardIcon(cardType) } className={ `${ CardStyle.iconClass }` } style={[{ tintColor: '#ffffff60' }, CardStyle.iconStyle]} />
                <Text className={`${ getCardStyle(cardType).textClass } text-stone-100`}
                      style={[{
                          textShadowColor: '#1c1917ff',
                          textShadowOffset: { width: 0, height: 1 },
                          textShadowRadius: 4
                      }]}
                >{ title }</Text>
            </View>
        </TouchableOpacity>
    )
};

export const SmallCard = ({ title, cardType, isFavorite, isLarge, background, onPress }: ICard) => {
    const CardStyle = getCardStyle(cardType);

    return (
        <TouchableOpacity className={`flex-row m-1 justify-start items-start gap-2 p-3 rounded-xl border-solid border-4 border-stone-700/50 ${ background }`}>
            <Image source={ getCardIcon(cardType) } className={ `${ CardStyle.iconClass }` } style={[{ tintColor: '#ffffff60' }, CardStyle.iconStyle]} />
            <Text className={`${ getCardStyle(cardType).textClass } text-stone-100 max-w-[80%]`}
                style={[{
                    textShadowColor: '#1c1917ff',
                    textShadowOffset: { width: 2, height: 2 },
                    textShadowRadius: 12
                }]}
            >{ title }</Text>
        </TouchableOpacity>
    )
};