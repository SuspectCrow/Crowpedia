import {View, Text} from 'react-native'
import React, {useEffect, useState} from 'react'
import {useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {getCardById, getCards} from "@/lib/appwrite";
import {ICard} from "@/interfaces/ICard";
import {useAppwrite} from "@/lib/useAppwrite";

const Property = () => {
    const { id } = useLocalSearchParams<{ id?: string }>()
    const [card, setCard] = useState<ICard | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let mounted = true
        async function load() {
            if (!id) return
            setLoading(true)
            const res = await getCardById(id as string)
            if (mounted) setCard(res as unknown as ICard | null)
            setLoading(false)
        }
        load()
        return () => { mounted = false }
    }, [id])

    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: '#292524',
            }}>
            <Text className=" font-dmsans-black text-4xl text-red-600">{card?.title ?? 'Bulunamadı'}</Text>
        </SafeAreaView>
    )
}
export default Property;