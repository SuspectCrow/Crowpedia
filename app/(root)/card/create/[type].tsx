import {View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {router, useLocalSearchParams} from "expo-router";
import {getCardIcon} from "@/constants/card_info";
import colors from "tailwindcss/colors";
import {MaterialIcons} from "@expo/vector-icons";
// NoteCreate dosyanın yolunun ve adının doğru olduğundan emin ol
import NoteCreate from "@/app/(root)/card/create/Sections/NoteCreate";
import TaskListCreate from "@/app/(root)/card/create/Sections/TaskListCreate";

const CreateCard = () => {
    const { type } = useLocalSearchParams<{ type?: string }>();

    const CardCreationContent = () => {
        switch (type) {
            case 'Note':
                return (
                    <NoteCreate
                        onClose={() => router.back()}
                        onSuccess={() => router.back()}
                    />
                );

            case 'TaskList':
                return (
                    <TaskListCreate
                        onClose={() => router.back()}
                        onSuccess={() => router.back()}
                    />
                );
            default:
                return <Text className="text-white text-center mt-10">Bilinmeyen Tür</Text>;
        }
    }

    return (
        <SafeAreaView className="h-full relative" style={{ backgroundColor: '#292524' }}>
            <View className="flex-row w-full items-center gap-2 px-4 pt-2">
                <TouchableOpacity
                    className="flex-row items-center justify-center gap-2 p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900"
                    onPress={() => { router.back(); }}
                >
                    <MaterialIcons name={"arrow-left"} size={24} color={colors.stone[400]}/>
                    <Text className={"text-stone-400 font-dmsans-bold text-xl"}>Back</Text>
                </TouchableOpacity>

                <View className="flex-1 flex-row items-center justify-start gap-2 p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-600">
                    <MaterialIcons name={getCardIcon(type)} size={24} style={{ color: colors.stone['900'] }}/>
                    <Text className="text-stone-900 font-dmsans-bold text-xl">
                        Create { type }
                    </Text>
                </View>
            </View>

            <View className="flex-1 mt-4">
                <CardCreationContent />
            </View>

        </SafeAreaView>
    )
}
export default CreateCard