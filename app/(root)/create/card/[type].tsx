import {View, Text, TouchableOpacity, Image, ScrollView, TextInput} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import C_NavBar from "@/components/C_NavBar";
import icons from "@/constants/icons";
import {router, useLocalSearchParams} from "expo-router";

const CreateCard = () => {
    const { type } = useLocalSearchParams<{ type?: string }>()
    return (
        <SafeAreaView className="p-1 h-full relative" style={{ backgroundColor: '#292524' }}>
            <View className="flex-row w-full items-center justify-around gap-2">
                <TouchableOpacity className="flex-row items-center justify-center gap-2 p-3 w-4/12 mt-4 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900" onPress={() => { router.push(`..`); }}>
                    <Image source={icons.arrow_left} className="size-8" style={[{ tintColor: '#a8a29e' }]} />
                    <Text className={"text-stone-400 font-dmsans-bold text-xl"}>Back</Text>
                </TouchableOpacity>
                <Text className="flex-row items-center justify-center gap-2 w-6/12 p-3 mt-4 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-600 text-stone-900 font-dmsans-bold text-xl">Create Card</Text>
            </View>

            <ScrollView className="mt-12">
                <View className="mx-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl">Title</Text>
                    <TextInput className="text-stone-400 font-dmsans-bold text-xl w-fit p-3 mt-4 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50" />
                </View>
                <View className="mx-4 mt-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl">Title</Text>
                    <TextInput className="text-stone-400 font-dmsans-bold text-xl w-fit p-3 mt-4 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50" />
                </View>
                <Text className="text-stone-400 font-dmsans-bold text-xl">Type: { type }</Text>

            </ScrollView>

        </SafeAreaView>
    )
}
export default CreateCard
