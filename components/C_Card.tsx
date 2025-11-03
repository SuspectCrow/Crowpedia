import {Image, Text, TouchableOpacity, View} from "react-native";
import images from "@/constants/images";
import icons from "@/constants/icons";

interface Props {
    onPress?: () => void;
    title: string;
    background?: any;
    isFolderCard?: boolean;
}


export const LargeCard = ({ title, background, isFolderCard, onPress }: Props) => {
    return (
        <TouchableOpacity className={`gap-3 m-1 relative h-72 rounded-xl border-solid border-stone-700/50 border-4`}>
            <Image source={background} className="size-full rounded-xl"  />
            <Image source={images.largecardgradient} className="absolute bottom-0 left-0 size-full rounded-xl" style={{ zIndex: 1 }} />
            <View className="absolute bottom-3 left-3 flex flex-row justify-start items-end gap-2 max-w-[75%]" style={{ zIndex: 2 }}>
                <Image source={isFolderCard ? icons.folder : icons.docs} className={ `${isFolderCard ? 'w-10 h-10' : 'w-8 h-8'} drop-shadow-xl` } style={[{ tintColor: '#ffffff60' }]} />
                <Text className={`${ isFolderCard ? 'font-dmsans-bold text-lg' : 'font-dmsans-light text-sm'} font-dmsans-bold text-lg text-stone-100 text-shadow-lg`}>{ title }</Text>
            </View>
        </TouchableOpacity>
    )
};

export const SmallCard = ({ title, background, isFolderCard, onPress }: Props) => {
    return (
        <TouchableOpacity className={`flex-row m-1 justify-start items-start gap-2 p-3 rounded-xl border-solid border-4 border-stone-700/50 ${ background }`}>
            <Image source={isFolderCard ? icons.folder : icons.docs} className={ `${isFolderCard ? 'w-10 h-10' : 'w-8 h-8'}` } style={[{ tintColor: '#ffffff60' }]} />
            <Text className={`${ isFolderCard ? 'font-dmsans-bold text-lg' : 'font-dmsans-light text-sm'} text-stone-100 max-w-[80%]`}>{ title }</Text>
        </TouchableOpacity>
    )
};