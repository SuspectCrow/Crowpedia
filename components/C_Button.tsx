import {View, Text, Image, TouchableOpacity} from 'react-native'
import React from 'react'

interface Props {
    onPress?: () => void;
    icon: any;
    dimensions?: {
        w: number;
        h: number;
    };
}

const CIconButton = ({ onPress, icon, dimensions } : Props) => {
    return (
        <TouchableOpacity onPress={onPress} className="flex items-center justify-center bg-stone-600 rounded-lg border-solid border-stone-700/50 border-4"
                          style={[{ zIndex: 99 },
                          dimensions ? { width: dimensions.w, height: dimensions.h } : { width: 64, height: 64 }]}>
            <Image source={icon} className="w-8 h-8" />
        </TouchableOpacity>
    )
}
export default CIconButton
