import {ICard} from "@/interfaces/ICard";
import {
    Alert,
    Clipboard,
    Linking,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import React, {useRef, useState} from "react";
import colors from "tailwindcss/colors";
import {updateCard} from "@/lib/appwrite";
import {MaterialIcons} from "@expo/vector-icons";
import {BackgroundSelector, BackgroundSelectorRef} from "@/components/C_CardBackgroundSelector";
import {AuthModal} from "@/components/C_AuthModal";

const PasswordDetail = ({ card, onRefresh }: { card: ICard, onRefresh: () => void }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const parsedContent = JSON.parse(card.content || '{}');

    const [title, setTitle] = useState(card.title);
    const [username, setUsername] = useState(parsedContent.username || '');
    const [password, setPassword] = useState(parsedContent.password || '');
    const [website, setWebsite] = useState(parsedContent.website || '');
    const [notes, setNotes] = useState(parsedContent.notes || '');

    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const backgroundSelectorRef = useRef<BackgroundSelectorRef>(null);

    React.useEffect(() => {
        if (!isAuthenticated) {
            setShowAuthModal(true);
        }
    }, []);

    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
        setShowAuthModal(false);
    };

    const handleAuthCancel = () => {
        setShowAuthModal(false);
        if (typeof onRefresh === 'function') {
            onRefresh();
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        Clipboard.setString(text);
        Alert.alert('Kopyalandı', `${label} panoya kopyalandı`);
    };

    const openWebsite = async () => {
        if (!website) return;

        let url = website.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Hata", "Bu link açılamıyor");
            }
        } catch (error) {
            Alert.alert("Hata", "Link açılırken bir sorun oluştu");
        }
    };

    const generatePassword = () => {
        const length = 16;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let newPassword = "";
        for (let i = 0; i < length; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(newPassword);
    };

    const handleSave = async () => {
        if (!title.trim() || !password.trim()) {
            Alert.alert("Eksik Bilgi", "Başlık ve şifre zorunludur");
            return;
        }

        setIsSaving(true);
        try {
            const contentObj = {
                username: username.trim(),
                password: password.trim(),
                website: website.trim(),
                notes: notes.trim()
            };

            await updateCard(card.$id, {
                title: title.trim(),
                content: JSON.stringify(contentObj)
            });

            card.title = title.trim();
            card.content = JSON.stringify(contentObj);

            if (backgroundSelectorRef.current) {
                await backgroundSelectorRef.current.save();
            }

            onRefresh();
            setIsEditing(false);
            Alert.alert("Başarılı", "Şifre güncellendi");
        } catch (error) {
            console.error("Update error:", error);
            Alert.alert("Hata", "Şifre güncellenirken bir sorun oluştu");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setTitle(card.title);
        setUsername(parsedContent.username || '');
        setPassword(parsedContent.password || '');
        setWebsite(parsedContent.website || '');
        setNotes(parsedContent.notes || '');
        setIsEditing(false);
    };

    if (!isAuthenticated) {
        return (
            <AuthModal
                visible={showAuthModal}
                onSuccess={handleAuthSuccess}
                onCancel={handleAuthCancel}
            />
        );
    }

    if (!isEditing) {
        return (
            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                <View className="bg-stone-800 rounded-xl border-4 border-stone-700/50 p-4 mb-4">
                    <Text className="text-stone-500 font-dmsans-medium text-sm mb-1">Başlık</Text>
                    <Text className="text-stone-200 font-dmsans-bold text-2xl">{card.title}</Text>
                </View>

                {website && (
                    <View className="bg-stone-800 rounded-xl border-4 border-stone-700/50 p-4 mb-4">
                        <Text className="text-stone-500 font-dmsans-medium text-sm mb-2">Website</Text>
                        <TouchableOpacity
                            onPress={openWebsite}
                            className="flex-row items-center gap-2"
                        >
                            <MaterialIcons name="language" size={20} color={colors.blue[400]} />
                            <Text className="text-blue-400 font-dmsans-medium text-base flex-1" numberOfLines={1}>
                                {website}
                            </Text>
                            <MaterialIcons name="open-in-new" size={20} color={colors.blue[400]} />
                        </TouchableOpacity>
                    </View>
                )}

                {username && (
                    <View className="bg-stone-800 rounded-xl border-4 border-stone-700/50 p-4 mb-4">
                        <Text className="text-stone-500 font-dmsans-medium text-sm mb-2">Kullanıcı Adı</Text>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-stone-200 font-dmsans-medium text-lg flex-1" numberOfLines={1}>
                                {username}
                            </Text>
                            <TouchableOpacity
                                onPress={() => copyToClipboard(username, 'Kullanıcı adı')}
                                className="p-2"
                            >
                                <MaterialIcons name="content-copy" size={20} color={colors.stone[400]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View className="bg-stone-800 rounded-xl border-4 border-stone-700/50 p-4 mb-4">
                    <Text className="text-stone-500 font-dmsans-medium text-sm mb-2">Şifre</Text>
                    <View className="flex-row items-center justify-between">
                        <Text
                            className="text-stone-200 font-dmsans-medium text-lg flex-1"
                            numberOfLines={1}
                        >
                            {showPassword ? password : '••••••••••••'}
                        </Text>
                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                className="p-2"
                            >
                                <MaterialIcons
                                    name={showPassword ? "visibility-off" : "visibility"}
                                    size={20}
                                    color={colors.stone[400]}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => copyToClipboard(password, 'Şifre')}
                                className="p-2"
                            >
                                <MaterialIcons name="content-copy" size={20} color={colors.stone[400]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {notes && (
                    <View className="bg-stone-800 rounded-xl border-4 border-stone-700/50 p-4 mb-4">
                        <Text className="text-stone-500 font-dmsans-medium text-sm mb-2">Notlar</Text>
                        <Text className="text-stone-200 font-dmsans-regular text-base">
                            {notes}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    className="bg-green-700 p-4 rounded-xl border-4 border-green-800/50 mb-12"
                >
                    <View className="flex-row items-center justify-center gap-2">
                        <MaterialIcons name="edit" size={24} color="white" />
                        <Text className="text-white font-dmsans-bold text-xl">Düzenle</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        );
    }

    return (
        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
            <View className="mb-4">
                <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Başlık</Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Başlık"
                    placeholderTextColor={colors.stone[600]}
                    className="w-full text-stone-300 font-dmsans-bold text-xl p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                />
            </View>

            <View className="mb-4">
                <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Website</Text>
                <TextInput
                    value={website}
                    onChangeText={setWebsite}
                    placeholder="https://example.com"
                    placeholderTextColor={colors.stone[600]}
                    keyboardType="url"
                    autoCapitalize="none"
                    className="w-full text-stone-300 font-dmsans-medium text-lg p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                />
            </View>

            <View className="mb-4">
                <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Kullanıcı Adı</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="kullanici@example.com"
                    placeholderTextColor={colors.stone[600]}
                    autoCapitalize="none"
                    className="w-full text-stone-300 font-dmsans-medium text-lg p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                />
            </View>

            <View className="mb-4">
                <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Şifre</Text>
                <View className="flex-row gap-2">
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Şifre"
                        placeholderTextColor={colors.stone[600]}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        className="flex-1 text-stone-300 font-dmsans-medium text-lg p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="p-4 bg-stone-700 rounded-xl border-4 border-stone-700/50"
                    >
                        <MaterialIcons
                            name={showPassword ? "visibility-off" : "visibility"}
                            size={24}
                            color={colors.stone[300]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={generatePassword}
                        className="p-4 bg-blue-700 rounded-xl border-4 border-blue-800/50"
                    >
                        <MaterialIcons name="autorenew" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="mb-4">
                <Text className="text-stone-400 font-dmsans-bold text-xl mb-2">Notlar</Text>
                <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Ek bilgiler..."
                    placeholderTextColor={colors.stone[600]}
                    multiline
                    numberOfLines={3}
                    className="w-full text-stone-300 font-dmsans-regular text-base p-4 rounded-xl border-4 border-stone-700/50 bg-stone-900/50"
                />
            </View>

            <BackgroundSelector ref={backgroundSelectorRef} card={card} />

            <View className="flex-row gap-4 my-6">
                <TouchableOpacity
                    onPress={handleCancel}
                    disabled={isSaving}
                    className="flex-1 bg-stone-700 p-4 rounded-xl border-4 border-stone-800/50"
                >
                    <Text className="text-white font-dmsans-bold text-xl text-center">İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-green-700 p-4 rounded-xl border-4 border-green-800/50"
                >
                    {isSaving ? (
                        <Text className="text-white font-dmsans-bold text-xl text-center">Kaydediliyor...</Text>
                    ) : (
                        <View className="flex-row items-center justify-center gap-2">
                            <MaterialIcons name="save" size={24} color="white" />
                            <Text className="text-white font-dmsans-bold text-xl text-center">Kaydet</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default PasswordDetail;