import {View, Text, TouchableOpacity, Image, ScrollView, TextInput} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import icons from "@/constants/icons";
import {router, useLocalSearchParams} from "expo-router";
import {getCardIcon} from "@/constants/card_info";
import resolveConfig from "tailwindcss/resolveConfig";

import colors from "tailwindcss/colors";

interface NewCardProps {
    title: string;
}



const CreateCard = () => {
    const { type } = useLocalSearchParams<{ type?: string }>()

    return (
        <SafeAreaView className="p-1 h-full relative" style={{ backgroundColor: '#292524' }}>
            <View className="flex-row w-full items-center gap-2 px-4">
                <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 p-3 mt-4 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900" onPress={() => { router.push(`..`); }}>
                    <Image source={icons.arrow_left} className="size-8" style={[{ tintColor: `${ colors.stone['400'] }` }]} />
                    <Text className={"text-stone-400 font-dmsans-bold text-xl"}>Back</Text>
                </TouchableOpacity>
                <View className="flex-2 flex-row items-center justify-start gap-2 p-3 mt-4 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-600">
                    <Image source={getCardIcon(type)} className="size-8" style={[{ tintColor: `${ colors.stone['800'] }` }]} />
                    <Text className="text-stone-900 font-dmsans-bold text-xl">
                        Create { type }
                    </Text>
                </View>
            </View>

            <View className="h-full mt-8">
                <View className="mx-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl">Title</Text>
                    <TextInput className="text-stone-400 font-dmsans-bold text-xl w-fit p-3 mt-4 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50" />
                </View>

                <View className="mx-4 h-full">
                    <Text className="text-stone-400 font-dmsans-bold text-xl">Title</Text>
                    <TextInput className="text-stone-400 font-dmsans-bold text-xl w-fit h-2/12 p-3 mt-4 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50" />
                </View>
            </View>

        </SafeAreaView>
    )
}
export default CreateCard
