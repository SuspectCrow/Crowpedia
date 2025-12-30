import React, {useRef, useState} from "react";
import {Alert, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {createCard} from "@/lib/appwrite";
import {BackgroundSelector, BackgroundSelectorRef} from "@/components/C_CardBackgroundSelector";
import {FolderSelector} from "@/components/C_FolderSelector";
import colors from "tailwindcss/colors";
import {ICard, CardVariant} from "@/interfaces/ICard";
import {MaterialIcons} from "@expo/vector-icons";
import {router} from "expo-router";

interface PasswordCreateProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const PasswordCreate = ({ onClose, onSuccess }: PasswordCreateProps) => {
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [website, setWebsite] = useState('');
    const [notes, setNotes] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const backgroundSelectorRef = useRef<BackgroundSelectorRef>(null);

    const initialCard: ICard = {
        $id: '',
        order: 10,
        title: '',
        content: '',
        type: 'Note',
        background: '#333',
        variant: CardVariant.SMALL
    };

    const generatePassword = () => {
        const length = 16;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(password);
    };

    const handleCreate = async () => {
        if (!title.trim()) {
            Alert.alert("Eksik Bilgi", "Lütfen bir başlık giriniz.");
            return;
        }
        if (!password.trim()) {
            Alert.alert("Eksik Bilgi", "Lütfen bir şifre giriniz.");
            return;
        }

        setIsCreating(true);

        try {
            let backgroundData = { background: '#333', variant: CardVariant.SMALL };

            if (backgroundSelectorRef.current) {
                backgroundData = backgroundSelectorRef.current.getValues();
            }

            const contentObj = {
                username: username.trim(),
                password: password.trim(),
                website: website.trim(),
                notes: notes.trim()
            };

            const newCardData: ICard = {
                title: title.trim(),
                type: 'Password',
                content: JSON.stringify(contentObj),
                background: backgroundData.background,
                variant: backgroundData.variant,
                parentFolder: selectedFolderId,
            } as ICard;

            await createCard(newCardData);

            Alert.alert("Başarılı", "Şifre kaydedildi!", [
                {
                    text: "Tamam",
                    onPress: () => {
                        if (onSuccess) onSuccess();
                        else router.replace('/home');
                    }
                }
            ]);

        } catch (error) {
            console.error("Create Password Error:", error);
            Alert.alert("Hata", "Şifre oluşturulurken bir sorun oluştu.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <View className="flex-1 bg-stone-950">
            <View className="p-4 border-b-4 border-stone-800 bg-stone-900 z-10">
                <Text className="text-stone-200 font-dmsans-bold text-2xl text-center">
                    Yeni Şifre
                </Text>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                <View className="mb-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Başlık *</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Örn: Google Hesabım"
                        placeholderTextColor={colors.stone['600']}
                        className="w-full text-stone-300 font-dmsans-bold text-xl p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Website</Text>
                    <TextInput
                        value={website}
                        onChangeText={setWebsite}
                        placeholder="https://example.com"
                        placeholderTextColor={colors.stone['600']}
                        keyboardType="url"
                        autoCapitalize="none"
                        className="w-full text-stone-300 font-dmsans-medium text-lg p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Kullanıcı Adı / Email</Text>
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        placeholder="kullanici@example.com"
                        placeholderTextColor={colors.stone['600']}
                        autoCapitalize="none"
                        className="w-full text-stone-300 font-dmsans-medium text-lg p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Şifre *</Text>
                    <View className="flex-row gap-2">
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Şifre"
                            placeholderTextColor={colors.stone['600']}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            className="flex-1 text-stone-300 font-dmsans-medium text-lg p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="p-4 bg-stone-700 rounded-xl border-4 border-stone-700/50 items-center justify-center"
                        >
                            <MaterialIcons
                                name={showPassword ? "visibility-off" : "visibility"}
                                size={24}
                                color={colors.stone[300]}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={generatePassword}
                            className="p-4 bg-blue-700 rounded-xl border-4 border-blue-800/50 items-center justify-center"
                        >
                            <MaterialIcons name="autorenew" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-4">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-3">Notlar</Text>
                    <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Ek bilgiler..."
                        placeholderTextColor={colors.stone['600']}
                        multiline
                        numberOfLines={3}
                        className="w-full text-stone-300 font-dmsans-regular text-base p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                    />
                </View>

                <View className="mb-4">
                    <FolderSelector
                        selectedFolderId={selectedFolderId}
                        onSelect={(id) => setSelectedFolderId(id)}
                    />
                </View>

                <View className="mb-20">
                    <Text className="text-stone-400 font-dmsans-bold text-xl mb-1">Görünüm</Text>
                    <BackgroundSelector
                        ref={backgroundSelectorRef}
                        card={initialCard}
                    />
                </View>
            </ScrollView>

            <View className="p-4 bg-stone-900 border-t-4 border-stone-800">
                <View className="flex-row gap-4">
                    <TouchableOpacity
                        className="flex-1 bg-stone-700 p-4 rounded-xl border-4 border-stone-700/50"
                        onPress={onClose}
                        disabled={isCreating}
                    >
                        <Text className="text-white font-dmsans-bold text-lg text-center">İptal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`flex-1 p-4 rounded-xl border-4 border-green-800/50 flex-row items-center justify-center gap-2 ${
                            isCreating ? 'bg-green-800' : 'bg-green-700'
                        }`}
                        onPress={handleCreate}
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <Text className="text-white font-dmsans-bold text-lg text-center">Kaydediliyor...</Text>
                        ) : (
                            <>
                                <MaterialIcons name="save" size={24} color="white" />
                                <Text className="text-white font-dmsans-bold text-lg text-center">Kaydet</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default PasswordCreate;