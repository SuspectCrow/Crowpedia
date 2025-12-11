import React from "react";
import {Alert, Text, View} from "react-native";
import {createCard} from "@/lib/appwrite";
import {ICard} from "@/interfaces/ICard";
import {router} from "expo-router";
import {NoteEditor} from "@/components/C_NoteEditor";

interface NoteCreateProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const NoteCreate = ({ onClose, onSuccess }: NoteCreateProps) => {

    const handleCreate = async (data: any) => {
        // data parametresi NoteEditor'den gelen { title, content, background, isLarge, parentFolder } objesidir.

        const newCardData: ICard = {
            title: data.title,
            type: 'Note',
            content: data.content,
            background: data.background,
            isLarge: data.isLarge,
            parentFolder: data.parentFolder,
        } as ICard;

        await createCard(newCardData);

        Alert.alert("Başarılı", "Notunuz oluşturuldu!", [
            {
                text: "Tamam",
                onPress: () => {
                    if (onSuccess) onSuccess();
                    else router.replace('/home');
                }
            }
        ]);
    };

    return (
        <View className="flex-1 bg-stone-950">
            <View className="p-4 border-b-4 border-stone-800 bg-stone-900 z-10">
                <Text className="text-stone-200 font-dmsans-bold text-2xl text-center">
                    Yeni Not Oluştur
                </Text>
            </View>

            <View className="flex-1 p-4">
                <NoteEditor
                    onSave={handleCreate}
                    onCancel={onClose}
                    saveButtonLabel="Oluştur"
                />
            </View>
        </View>
    );
};

export default NoteCreate;