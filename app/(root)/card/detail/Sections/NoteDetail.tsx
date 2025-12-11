import {ICard} from "@/interfaces/ICard";
import React, {useRef, useState} from "react";
import {RichEditor} from "react-native-pell-rich-editor";
import {ScrollView, Text, TouchableOpacity, View, Alert} from "react-native";
import colors from "tailwindcss/colors";
import {updateCard} from "@/lib/appwrite";
import showdown from "showdown";
import { MaterialIcons } from "@expo/vector-icons";
import {NoteEditor} from "@/components/C_NoteEditor"; // YENİ COMPONENT

const converter = new showdown.Converter();

const NoteViewer = ({ card, onEdit }: { card: ICard, onEdit: () => void }) => {
    const richText = useRef<RichEditor>(null);
    const initialHtml = converter.makeHtml(card.content ?? '');

    return (
        <View className="flex-1">
            <ScrollView className="mb-4">
                <RichEditor
                    ref={richText}
                    initialContentHTML={initialHtml}
                    disabled={true}
                    placeholder="İçerik bulunamadı..."
                    containerStyle={{
                        backgroundColor: '#1c1917',
                        borderRadius: 12,
                        borderColor: colors.stone[700] + '80',
                        borderWidth: 4,
                        minHeight: 300,
                    }}
                    editorStyle={{
                        backgroundColor: '#1c1917',
                        color: '#d6d3d1',
                        placeholderColor: colors.stone[600],
                        contentCSSText: `
                            font-family: 'DMSans-Regular', sans-serif;
                            font-size: 16px;
                            line-height: 1.5;
                            padding: 16px;
                        `
                    }}
                />
            </ScrollView>

            <TouchableOpacity
                className="bg-stone-600 p-4 rounded-xl border-solid border-stone-700/50 border-4"
                onPress={onEdit}
            >
                <View className="flex-row items-center justify-center gap-2">
                    <MaterialIcons name={"edit-note"} size={24} style={[{ color: 'white' }]} />
                    <Text className="text-white font-dmsans-bold text-lg text-center">Düzenle</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

// NoteEditor fonksiyonunu sildik, yerine C_NoteEditor kullanıyoruz

const NoteDetail = ({ card }: { card: ICard }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = async (data: any) => {
        if (!card.$id) return;

        // Değişiklik kontrolü (opsiyonel ama iyi olur)
        if (data.content === card.content && data.title === card.title &&
            data.background === card.background && data.isLarge === card.isLarge &&
            data.parentFolder === card.parentFolder) {
            Alert.alert("Değişiklik Yok", "Herhangi bir değişiklik yapmadınız.");
            setIsEditing(false);
            return;
        }

        try {
            await updateCard(card.$id, {
                title: data.title,
                content: data.content,
                background: data.background,
                isLarge: data.isLarge,
                // parentFolder güncellemesi gerekirse buraya eklenebilir
                // appwrite.ts içindeki updateCard fonksiyonuna parentFolder desteği eklemen gerekebilir.
            });

            // UI'ı güncelle
            card.title = data.title;
            card.content = data.content;
            card.background = data.background;
            card.isLarge = data.isLarge;

            setIsEditing(false);
        } catch (error) {
            console.error("Kaydetme hatası:", error);
            Alert.alert("Hata", "Not güncellenirken bir sorun oluştu.");
        }
    };

    if (isEditing) {
        return (
            <NoteEditor
                initialData={card}
                onSave={handleUpdate}
                onCancel={() => setIsEditing(false)}
                saveButtonLabel="Güncelle"
            />
        );
    }

    return <NoteViewer card={card} onEdit={() => setIsEditing(true)} />;
};

export default NoteDetail;