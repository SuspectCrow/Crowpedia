import {View, Text, TouchableOpacity, Image} from 'react-native'
import React, {useState} from 'react'
import icons from "@/constants/icons";

interface Props {
    activePaths: string[];
    OnPressBack?: () => void;
}

const CNavBar = ({ activePaths, OnPressBack } : Props) => {
    const [navbarVisibility, setNavbarVisibility] = useState(false);

    return (
        <View>
            <TouchableOpacity className="p-4 mx-2 mt-4 rounded-xl border-solid border-4 border-stone-700/50"  onPress={() => setNavbarVisibility(v => !v)}>
                <View className="flex-row items-center justify-end me-6 overflow-hidden">
                    {activePaths.map((item, index) => (
                        <View key={index} className="flex-row items-center">
                            <Text className={`${ index == activePaths.length - 1 ? 'text-stone-400' : 'text-stone-600' } font-dmsans-bold text-lg`}>
                                { item }
                            </Text>

                            {index < activePaths.length - 1 && (
                                <Image source={icons.arrow_forward} className="size-6 mx-2" style={[{ tintColor: '#78716c' }]} />
                            )}
                        </View>
                    ))}
                </View>
            </TouchableOpacity>

            {
                navbarVisibility && (
                    <View className="p-4 rounded-xl border-solid border-4 bg-stone-900 border-stone-700/50">
                        <TouchableOpacity className="p-3 rounded-xl border-solid border-4 bg-stone-700 border-stone-900/50" onPress={OnPressBack}>
                            <View className="flex-row items-center justify-center">
                                <Image source={icons.arrow_left} className="size-6 mx-2" />
                                <Text className="font-dmsans-bold text-lg text-white">Back</Text>
                            </View>
                        </TouchableOpacity>
                        <View className="flex-col items-start justify-start gap-2 mt-4">
                            {activePaths.map((item, index) => (
                                <TouchableOpacity key={index} className="flex-row items-center  w-full" disabled={ index == activePaths.length - 1 }>
                                    { index == activePaths.length - 1 && (
                                        <Image source={icons.arrow_forward} className="size-6" style={[{ tintColor: '#fff' }]} />
                                    )}
                                    <Image source={icons.folder} className="size-7 mx-2" style={[{ tintColor: `${index == activePaths.length -1 ? '#fff' : '#78716c'}` }]} />
                                    <Text className={`${ index == activePaths.length - 1 ? 'text-stone-300 font-dmsans-bold' : 'text-stone-600 font-dmsans-medium' } text-xl`}>
                                        { item }
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )
            }
        </View>
    )
}
export default CNavBar
