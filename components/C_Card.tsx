import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {ICard} from "@/interfaces/ICard";
import {getCardIcon} from "@/constants/card_info";
import colors from "tailwindcss/colors";
import {MaterialIcons} from "@expo/vector-icons";
import images from "@/constants/images";

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
            tintColor: `${ colors.sky['500'] }`,
        }
    }
}

export const getCardStyle = (type: string | undefined): CardStyle => {
    return CardStyleMap[type as keyof typeof CardStyleMap] || CardStyleMap.Default;
}

const borderRadius = "rounded-lg";

function isNetworkUrl(urlString : string) {
    if (!urlString) return false;

    try {
        const url = new URL(urlString);

        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
        return false;
    }
}

interface ICardProps {
    onPress?: () => void;
    onLongPress?: () => void;
    card: ICard;
}

const renderCardContent = (card: ICard, CardStyle: any) => {
    switch (card.type) {
        case "SimpleTask":
            return (
                <View className="flex flex-row justify-start items-start gap-2">
                    <MaterialIcons name={card.content === "true" ? "check" : "check-box-outline-blank"} size={24} className={ `${ CardStyle.iconClass } ${ card.content === "true" ? "opacity-80" : "" }` } style={[{ color: colors.stone["100"] }, CardStyle.iconStyle]}/>
                    <Text className={`${ getCardStyle(card.type).textClass } max-w-[80%] ${ card.content === "true" ? "line-through text-stone-100/50" : "text-stone-100/80" }`}>{ card.title }</Text>
                </View>
            )
        default:
            return (
                <View className="flex flex-row justify-start items-end gap-2">
                    <MaterialIcons name={getCardIcon(card.type)} size={24} className={ `${ CardStyle.iconClass }` } style={[{ color: colors.stone["100"] }, CardStyle.iconStyle]} />
                    <Text className={`${ getCardStyle(card.type).textClass } text-stone-100/80 max-w-[80%]`}>{ card.title }</Text>
                </View>
            )
    }
}

function isColorString(str: string) {
    return str.includes("#") || str.includes("rgb") || str.includes("rgba");
}

export const LargeCard = ({card, onPress, onLongPress} : ICardProps) => {
    const CardStyle = getCardStyle(card.type);

    return (
        <TouchableOpacity className={`gap-3 m-1 relative h-72 ${borderRadius} border-solid border-stone-700/50 border-4`} style={ [ isColorString(card.background) ? { backgroundColor: card.background as string } : {} ]  } onPress={onPress} onLongPress={onLongPress}>
            <Image source={ isNetworkUrl(card.background) ? { uri: card.background } : card.background } className={`size-full`} />
            <Image source={images.largecardgradient} className={`absolute bottom-0 left-0 size-full`} style={{ zIndex: 1 }} />
            <View className="absolute bottom-3 left-3 max-w-[75%]" style={{ zIndex: 2 }}>
                { renderCardContent(card, CardStyle) }
            </View>
        </TouchableOpacity>
    )
};

export const SmallCard = ({card, onPress, onLongPress} : ICardProps) => {
    const CardStyle = getCardStyle(card.type);

    return (
        <TouchableOpacity className={`flex-row m-1 justify-start items-start gap-2 p-3 ${borderRadius} border-solid border-4 border-stone-700/50`} style={ [ isColorString(card.background) ? { backgroundColor: card.background as string } : {} ]  } onPress={onPress} onLongPress={onLongPress}>
            { renderCardContent(card, CardStyle) }
        </TouchableOpacity>
    )
};