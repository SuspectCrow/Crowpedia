import {View, Text, TouchableOpacity, Image, Alert} from 'react-native'
import React, {useState} from 'react'
import colors from "tailwindcss/colors";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
    activePaths: string[];
    OnPressBack?: () => void;
}

const CNavBar = ({ activePaths, OnPressBack } : Props) => {
    const [navbarVisibility, setNavbarVisibility] = useState(false);
    let pathLenght = 0;

    for (let i = 0; i < activePaths.length; i++) {
        pathLenght += activePaths[i].length;
    }

    return (
        <View className="flex-row items-center justify-center gap-2 mt-4 px-6" style={[{ width: '80%', marginHorizontal: 'auto' }]}>
            {
                activePaths.length > 1 && (
                    <TouchableOpacity className="p-3 rounded-xl border-solid border-4 bg-stone-700 border-stone-900/50" onPress={OnPressBack}>
                        <View className="flex-row items-center justify-center">
                            <MaterialIcons name={"arrow-left"} size={24} className="mx-2" style={{ color: 'white' }}/>
                            <Text className="font-dmsans-bold text-lg text-white">Back</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
            <View className={`flex-row items-center w-[100%] ${pathLenght <= 12 ? "justify-center" : "justify-end"} overflow-hidden p-4 rounded-xl border-solid border-4 border-stone-700/50`}>
                {activePaths.map((item, index) => (
                    <View key={index} className="flex-row items-center">
                        {index === 0 && (
                            <MaterialIcons name={"home"} size={24} className="me-1 mb-auto" style={{ color: `${index == activePaths.length - 1 ? colors.stone['400'] : colors.stone['600']}` }}/>
                        )}
                        <Text className={`${ index == activePaths.length - 1 ? 'text-stone-400' : 'text-stone-600' } ${ index === 0 ? 'font-dmsans-black text-xl' : 'font-dmsans-semibold text-lg' }`}>
                            { item == "HOME" ? "Home" : item }
                        </Text>

                        {index < activePaths.length - 1 && (
                            <MaterialIcons name={"arrow-left"} size={24} className="mx-2" style={{ color: `${ colors.stone['500'] }` }}/>
                        )}
                    </View>
                ))}
            </View>

        </View>
    )
}
export default CNavBar
