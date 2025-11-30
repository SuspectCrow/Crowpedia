import {ICard} from "@/interfaces/ICard";
import React, {useRef, useState} from "react";
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {Alert, Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import colors from "tailwindcss/colors";
import icons from "@/constants/icons";
import htmlToMd from "html-to-md";
import {updateCard} from "@/lib/appwrite";
import showdown from "showdown";

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
                    <Image source={icons.edit_note} className="size-6" style={[{ tintColor: '#fff' }]} />
                    <Text className="text-white font-dmsans-bold text-lg text-center">Düzenle</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const NoteEditor = ({ card, onCancel }: { card: ICard, onCancel: () => void }) => {
    const richText = useRef<RichEditor>(null);
    const initialHtml = converter.makeHtml(card.content ?? '');
    const [editedHtml, setEditedHtml] = useState(initialHtml);

    const handleSave = async () => {
        if (!card.$id) return;

        const markdownContent = htmlToMd(editedHtml);

        if (markdownContent === card.content) {
            Alert.alert("Değişiklik Yok", "Herhangi bir değişiklik yapmadınız.");
            onCancel();
            return;
        }

        try {
            await updateCard(card.$id, { content: markdownContent });
            card.content = markdownContent;
            Alert.alert("Başarılı", "Notunuz güncellendi.");
        } catch (error) {
            console.error("Kaydetme hatası:", error);
            Alert.alert("Hata", "Not kaydedilirken bir sorun oluştu.");
        }
    };

    return (
        <View className="flex-1">
            <RichToolbar
                editor={richText}
                actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.setStrikethrough,
                    actions.removeFormat,
                    actions.heading1,
                    actions.heading2,
                    actions.heading3,
                    actions.heading4,
                    actions.heading5,
                    actions.heading6,
                    actions.alignLeft,
                    actions.alignCenter,
                    actions.alignRight,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                    actions.blockquote,
                    actions.code,
                    actions.undo,
                    actions.redo
                ]}
                style={{
                    backgroundColor: '#1c1917',
                    borderColor: colors.stone[700],
                    borderWidth: 2,
                    borderRadius: 12,
                    marginBottom: 8,
                }}
                selectedIconTint={colors.sky[400]}
                iconTint={colors.stone[400]}
                iconMap={{
                    [ actions.setBold ] : icons.format_bold,
                    [ actions.setItalic ] : icons.format_italic,
                    [ actions.setUnderline ] : icons.format_underlined,
                    [ actions.setStrikethrough ] : icons.strikethrough_s,
                    [ actions.heading1 ] : icons.format_h1,
                    [ actions.heading2 ] : icons.format_h2,
                    [ actions.heading3 ] : icons.format_h3,
                    [ actions.heading4 ] : icons.format_h4,
                    [ actions.heading5 ] : icons.format_h5,
                    [ actions.heading6 ] : icons.format_h6,
                    [ actions.insertBulletsList ] : icons.list,
                    [ actions.insertOrderedList ] : icons.format_list_numbered,
                    [ actions.insertLink ] : icons.link,
                    [ actions.blockquote ] : icons.format_quote,
                    [ actions.code ] : icons.code,
                    [ actions.undo ] : icons.undo,
                    [ actions.redo ] : icons.redo,
                }}
            />

            <ScrollView className="flex-1 mb-4">
                <RichEditor
                    ref={richText}
                    initialContentHTML={editedHtml}
                    onChange={setEditedHtml}
                    placeholder="Notunuzu buraya yazın..."
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

            <View className="flex-row gap-2">
                <TouchableOpacity
                    className="flex-1 bg-stone-700 p-4 rounded-xl border-solid border-stone-700/50 border-4"
                    onPress={onCancel}
                >
                    <Text className="text-white font-dmsans-bold text-lg text-center">İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 bg-green-700 p-4 rounded-xl border-solid border-green-800/50 border-4"
                    onPress={handleSave}
                >
                    <Text className="text-white font-dmsans-bold text-lg text-center">Kaydet</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const NoteDetail = ({ card }: { card: ICard }) => {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return <NoteEditor card={card} onCancel={() => setIsEditing(false)} />;
    }

    return <NoteViewer card={card} onEdit={() => setIsEditing(true)} />;
};

export default NoteDetail;