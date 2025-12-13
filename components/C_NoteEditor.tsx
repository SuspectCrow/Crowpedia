import React, {useRef, useState} from 'react';
import {ScrollView, Text, TextInput, TouchableOpacity, View, Alert} from 'react-native';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {BackgroundSelector, BackgroundSelectorRef} from "@/components/C_CardBackgroundSelector";
import {FolderSelector} from "@/components/C_FolderSelector";
import colors from "tailwindcss/colors";
import {MaterialIcons} from "@expo/vector-icons";
import htmlToMd from "html-to-md";
import showdown from "showdown";
import {ICard} from "@/interfaces/ICard";

const converter = new showdown.Converter();

interface NoteEditorProps {
    // Düzenleme modunda ise mevcut kart verisi, yeni ise undefined olabilir
    initialData?: Partial<ICard>;
    onSave: (data: {
        title: string;
        content: string;
        background: string;
        isLarge: boolean;
        parentFolder: string | null;
    }) => Promise<void>;
    onCancel: () => void;
    saveButtonLabel?: string;
}

export const NoteEditor = ({ initialData, onSave, onCancel, saveButtonLabel = "Kaydet" }: NoteEditorProps) => {
    // State Tanımları
    const [title, setTitle] = useState(initialData?.title || '');
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
        // initialData.parentFolder obje ise ID'sini al, string ise direkt al, yoksa null
        typeof initialData?.parentFolder === 'object' && initialData.parentFolder
            ? (initialData.parentFolder as any).$id
            : (initialData?.parentFolder || null)
    );
    const [isSaving, setIsSaving] = useState(false);

    // Refs
    const richText = useRef<RichEditor>(null);
    const backgroundSelectorRef = useRef<BackgroundSelectorRef>(null);

    // HTML İçeriği Hazırla (Düzenleme ise Markdown -> HTML çevir)
    const initialHtml = initialData?.content ? converter.makeHtml(initialData.content) : '';
    const [contentHtml, setContentHtml] = useState(initialHtml);

    // BackgroundSelector için başlangıç verisi hazırlığı
    const initialCardMock = {
        $id: '',
        order: 10,
        title: '',
        type: 'Note',
        content: '',
        background: initialData?.background || '#333',
        isLarge: initialData?.isLarge || false,
    } as ICard;

    const handleSavePress = async () => {
        if (!title.trim()) {
            Alert.alert("Eksik Bilgi", "Lütfen bir başlık giriniz.");
            return;
        }

        setIsSaving(true);
        try {
            // 1. HTML'i Markdown'a çevir
            const markdownContent = htmlToMd(contentHtml);

            // 2. Background değerlerini al
            let backgroundData = { background: '#333', isLarge: false };
            if (backgroundSelectorRef.current) {
                backgroundData = backgroundSelectorRef.current.getValues();
            }

            // 3. Parent'a veriyi gönder
            await onSave({
                title: title,
                content: markdownContent,
                background: backgroundData.background,
                isLarge: backgroundData.isLarge,
                parentFolder: selectedFolderId
            });

        } catch (error) {
            console.error("Editor Save Error:", error);
            Alert.alert("Hata", "Kaydetme işlemi sırasında bir sorun oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Üst Kısım: Başlık, Klasör, Arka Plan */}
            <View className="mb-2">
                <View className="mb-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Title</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Başlık Girin"
                        placeholderTextColor={colors.stone['600']}
                        className="w-full text-stone-300 font-dmsans-bold text-xl p-3 rounded-xl border-solid border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                <View className="mb-4">
                    <FolderSelector
                        selectedFolderId={selectedFolderId}
                        onSelect={(id) => setSelectedFolderId(id)}
                    />
                </View>

                <BackgroundSelector ref={backgroundSelectorRef} card={initialCardMock} />
            </View>

            {/* Editör Toolbar */}
            <RichToolbar
                editor={richText}
                actions={[
                    actions.setBold, actions.setItalic, actions.setUnderline, actions.setStrikethrough,
                    actions.removeFormat, actions.heading1, actions.heading2, actions.insertBulletsList,
                    actions.insertOrderedList, actions.blockquote, actions.code, actions.undo, actions.redo
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
            />

            {/* Editör Alanı */}
            <View className="flex-1 mb-4" style={{ minHeight: 300 }}>
                <RichEditor
                    ref={richText}
                    initialContentHTML={initialHtml}
                    onChange={setContentHtml}
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
                            color: #d6d3d1;
                        `
                    }}
                />
            </View>

            {/* Aksiyon Butonları */}
            <View className="flex-row gap-2 mb-8">
                <TouchableOpacity
                    className="flex-1 bg-stone-700 p-4 rounded-xl border-solid border-stone-700/50 border-4"
                    onPress={onCancel}
                    disabled={isSaving}
                >
                    <Text className="text-white font-dmsans-bold text-lg text-center">İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 p-4 rounded-xl border-solid border-green-800/50 border-4 ${
                        isSaving ? 'bg-green-800' : 'bg-green-700'
                    }`}
                    onPress={handleSavePress}
                    disabled={isSaving}
                >
                    <Text className="text-white font-dmsans-bold text-lg text-center">
                        {isSaving ? "İşleniyor..." : saveButtonLabel}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};