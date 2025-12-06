import {getCardStyle} from "@/components/C_Card";
import {ICard} from "@/interfaces/ICard";
import images from "@/constants/images";
import icons from "@/constants/icons";
import colors from "tailwindcss/colors";
import {Image, Text, TouchableOpacity, View} from "react-native";

const borderRadius = "rounded-lg";

interface ICardProps {
    onPress?: () => void;
    onLongPress?: () => void;
    card: ICard;
    movieItem: any;
}

export const MovieCard = ({ card, onPress, onLongPress, movieItem }: ICardProps) => {
    const CardStyle = getCardStyle(card.type);

    if (!movieItem || !movieItem.metadata) {
        return (
            <TouchableOpacity
                className={`flex-row m-1 justify-start items-start gap-2 p-3 ${borderRadius} border-solid border-4 border-stone-700/50 bg-stone-900`}
                onPress={onPress}
                onLongPress={onLongPress}
            >
                <Text className="text-white font-dmsans-medium">Film bilgisi eksik</Text>
            </TouchableOpacity>
        );
    }

    const { metadata } = movieItem;
    const posterUrl = metadata.poster || metadata.background;

    return (
        <TouchableOpacity
            className={`gap-3 m-1 relative h-72 ${borderRadius} border-solid border-stone-700/50 border-4 overflow-hidden`}
            onPress={onPress}
            onLongPress={onLongPress}
        >
            <Image
                source={{ uri: posterUrl }}
                className={`size-full ${borderRadius}`}
                resizeMode="cover"
            />
            <Image
                source={images.largecardgradient}
                className={`absolute bottom-0 left-0 size-full ${borderRadius}`}
                style={{ zIndex: 1 }}
            />
            <View className="absolute bottom-3 left-3 max-w-[75%]" style={{ zIndex: 2 }}>
                <View className="flex flex-row justify-start items-end gap-2">
                    <Image
                        source={icons.save}
                        className={`${CardStyle.iconClass}`}
                        style={[{ tintColor: colors.stone["100"] }, CardStyle.iconStyle]}
                    />
                    <Text className="font-dmsans-medium text-base text-stone-100/80 max-w-[80%]" numberOfLines={2}>
                        {metadata.title || "Unknown"}
                    </Text>
                </View>
                {!!movieItem.rating && (
                    <View className="flex flex-row items-center gap-1 mt-1">
                        <Image
                            source={icons.star}
                            className="size-4"
                            style={{ tintColor: colors.yellow["400"] }}
                        />
                        <Text className="font-dmsans-regular text-sm text-stone-100/60">
                            {movieItem.rating}/5
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};