import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import images from "@/constants/images";
import {ICard} from "@/interfaces/ICard";
import {getCardIcon} from "@/constants/card_info";
import Index from "@/app/(root)/(tabs)";
import {GestureResponderEvent} from "react-native/Libraries/Types/CoreEventTypes";

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
    item: ICard;
}

function isColorString(str: string) {
    return str.includes("#") || str.includes("rgb") || str.includes("rgba");
}

export const LargeCard = ({item, onPress} : ICardProps) => {
    const CardStyle = getCardStyle(item.type);

    return (
        <TouchableOpacity className={`gap-3 m-1 relative h-72 ${borderRadius} border-solid border-stone-700/50 border-4`} onPress={onPress}>
            <Image source={ isNetworkUrl(item.background) ? { uri: item.background } : item.background } className={`size-full ${borderRadius}`} />
            <Image source={images.largecardgradient} className={`absolute bottom-0 left-0 size-full ${borderRadius}`} style={{ zIndex: 1 }} />
            <View className="absolute bottom-3 left-3 flex flex-row justify-start items-end gap-2 max-w-[75%]" style={{ zIndex: 2 }}>
                <Image source={ getCardIcon(item.type) } className={ `${ CardStyle.iconClass }` } style={[{ tintColor: '#ffffff80' }, CardStyle.iconStyle]} />
                <Text className={`${ getCardStyle(item.type).textClass } text-stone-100/80 max-w-[80%]`}>{ item.title }</Text>
            </View>
            {/*<Text className="absolute top-2 right-2 bg-white p-2 rounded-full text-center text-md font-dmsans-bold">{ index + " | " + order}</Text>*/}
        </TouchableOpacity>
    )
};

export const SmallCard = ({item, onPress} : ICardProps) => {
    const CardStyle = getCardStyle(item.type);

    return (
        <TouchableOpacity className={`flex-row m-1 justify-start items-start gap-2 p-3 ${borderRadius} border-solid border-4 border-stone-700/50`} style={ [ isColorString(item.background) ? { backgroundColor: item.background as string } : {} ]  } onPress={onPress}>
            <Image source={ getCardIcon(item.type) } className={ `${ CardStyle.iconClass }` } style={[{ tintColor: '#ffffff80' }, CardStyle.iconStyle]} />
            <Text className={`${ getCardStyle(item.type).textClass } text-stone-100/80 max-w-[80%]`}>{ item.title }</Text>
            {/*<Text className="absolute top-2 right-2 bg-white p-2 rounded-full text-center text-md font-dmsans-bold">{ index + " | " + order}</Text>*/}
        </TouchableOpacity>
    )
};
