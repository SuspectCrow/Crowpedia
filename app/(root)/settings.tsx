import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
    TextInput,
    Alert,
    Modal
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import { getSettings, saveSettings, AppSettings } from '@/lib/settings';
import { checkBiometricAvailability } from '@/lib/biometricAuth';

const Settings = () => {
    const [settings, setSettings] = useState<AppSettings>({
        useBiometric: true,
        pin: null,
        pinHint: null,
        theme: 'dark'
    });

    const [biometricAvailable, setBiometricAvailable] = useState(false);
    const [biometricType, setBiometricType] = useState<string | null>(null);
    const [showPinModal, setShowPinModal] = useState(false);
    const [tempPin, setTempPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [tempHint, setTempHint] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
        checkBiometric();
    }, []);

    const loadSettings = async () => {
        try {
            const stored = await getSettings();
            setSettings(stored);
            setTempHint(stored.pinHint || '');
        } catch (error) {
            console.error('Settings load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkBiometric = async () => {
        const { available, type } = await checkBiometricAvailability();
        setBiometricAvailable(available);
        setBiometricType(type);
    };

    const handleSaveSetting = async (key: keyof AppSettings, value: any) => {
        try {
            const updated = { ...settings, [key]: value };
            setSettings(updated);
            await saveSettings({ [key]: value });
        } catch (error) {
            Alert.alert('Hata', 'Ayar kaydedilemedi');
        }
    };

    const handleToggleBiometric = async (value: boolean) => {
        if (!biometricAvailable && value) {
            Alert.alert(
                'Uyarı',
                'Cihazınızda biyometrik kimlik doğrulama kullanılamıyor. PIN kullanmanız gerekiyor.'
            );
            return;
        }

        if (!value && !settings.pin) {
            Alert.alert(
                'PIN Gerekli',
                'Biyometrik doğrulamayı kapatmak için önce bir PIN belirlemelisiniz.',
                [
                    { text: 'İptal', style: 'cancel' },
                    { text: 'PIN Belirle', onPress: () => setShowPinModal(true) }
                ]
            );
            return;
        }

        await handleSaveSetting('useBiometric', value);
    };

    const handleSavePin = async () => {
        if (tempPin.length < 4) {
            Alert.alert('Hata', 'PIN en az 4 karakter olmalıdır');
            return;
        }

        if (tempPin !== confirmPin) {
            Alert.alert('Hata', 'PIN\'ler eşleşmiyor');
            return;
        }

        try {
            await saveSettings({
                pin: tempPin,
                pinHint: tempHint || null
            });
            setSettings(prev => ({
                ...prev,
                pin: tempPin,
                pinHint: tempHint || null
            }));
            setShowPinModal(false);
            setTempPin('');
            setConfirmPin('');
            Alert.alert('Başarılı', 'PIN kaydedildi');
        } catch (error) {
            Alert.alert('Hata', 'PIN kaydedilemedi');
        }
    };

    const getBiometricIcon = () => {
        switch (biometricType) {
            case 'fingerprint':
                return 'fingerprint';
            case 'face':
                return 'face';
            default:
                return 'security';
        }
    };

    const getBiometricLabel = () => {
        switch (biometricType) {
            case 'fingerprint':
                return 'Parmak İzi';
            case 'face':
                return 'Yüz Tanıma';
            default:
                return 'Biyometrik';
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-stone-900 items-center justify-center">
                <Text className="text-stone-400 font-dmsans-medium">Yükleniyor...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#292524' }}>
            <View className="flex-row items-center gap-2 px-4 pt-2 pb-4">
                <TouchableOpacity
                    className="flex-row items-center justify-center gap-2 p-3 rounded-xl border-4 border-stone-700/50 bg-stone-900"
                    onPress={() => router.back()}
                >
                    <MaterialIcons name="arrow-left" size={24} color={colors.stone[400]} />
                    <Text className="text-stone-400 font-dmsans-bold text-xl">Geri</Text>
                </TouchableOpacity>

                <View className="flex-1 flex-row items-center justify-start gap-2 p-3 rounded-xl border-4 border-stone-700/50 bg-stone-600">
                    <MaterialIcons name="settings" size={24} color={colors.stone[900]} />
                    <Text className="text-stone-900 font-dmsans-bold text-xl">Ayarlar</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                <View className="mt-4 mb-6">
                    <Text className="text-stone-400 font-dmsans-bold text-2xl mb-4">
                        Güvenlik
                    </Text>

                    <View className="bg-stone-800 rounded-xl border-4 border-stone-700/50 p-4 mb-3">
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-row items-center gap-3 flex-1">
                                <MaterialIcons
                                    name={getBiometricIcon() as any}
                                    size={24}
                                    color={colors.stone[400]}
                                />
                                <View className="flex-1">
                                    <Text className="text-stone-200 font-dmsans-bold text-lg">
                                        {getBiometricLabel()} Kullan
                                    </Text>
                                    {!biometricAvailable && (
                                        <Text className="text-red-400 font-dmsans-regular text-sm mt-1">
                                            Cihazda kullanılamıyor
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <Switch
                                value={settings.useBiometric}
                                onValueChange={handleToggleBiometric}
                                disabled={!biometricAvailable}
                                trackColor={{
                                    false: colors.stone[700],
                                    true: colors.green[700]
                                }}
                                thumbColor={
                                    settings.useBiometric
                                        ? colors.green[500]
                                        : colors.stone[400]
                                }
                            />
                        </View>
                        <Text className="text-stone-500 font-dmsans-regular text-sm">
                            Şifre kartlarını açarken {getBiometricLabel().toLowerCase()} kullan
                        </Text>
                    </View>

                    <View className="bg-stone-800 rounded-xl border-4 border-stone-700/50 p-4">
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-row items-center gap-3 flex-1">
                                <MaterialIcons name="pin" size={24} color={colors.stone[400]} />
                                <View className="flex-1">
                                    <Text className="text-stone-200 font-dmsans-bold text-lg">
                                        PIN Kodu
                                    </Text>
                                    {settings.pin && (
                                        <Text className="text-green-400 font-dmsans-regular text-sm mt-1">
                                            ✓ PIN ayarlanmış
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowPinModal(true)}
                                className="bg-stone-700 px-4 py-2 rounded-lg"
                            >
                                <Text className="text-white font-dmsans-bold">
                                    {settings.pin ? 'Değiştir' : 'Ayarla'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="text-stone-500 font-dmsans-regular text-sm">
                            {settings.useBiometric
                                ? 'Biyometrik başarısız olursa PIN kullanılır'
                                : 'Şifre kartları için PIN gereklidir'
                            }
                        </Text>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-stone-400 font-dmsans-bold text-2xl mb-4">
                        Görünüm
                    </Text>

                    <View className="bg-stone-800 rounded-xl border-4 border-stone-700/50 p-4">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <MaterialIcons
                                    name={settings.theme === 'dark' ? 'dark-mode' : 'light-mode'}
                                    size={24}
                                    color={colors.stone[400]}
                                />
                                <Text className="text-stone-200 font-dmsans-bold text-lg">
                                    Karanlık Mod
                                </Text>
                            </View>
                            <Switch
                                value={settings.theme === 'dark'}
                                onValueChange={(value) =>
                                    handleSaveSetting('theme', value ? 'dark' : 'light')
                                }
                                trackColor={{
                                    false: colors.stone[700],
                                    true: colors.blue[700]
                                }}
                                thumbColor={
                                    settings.theme === 'dark'
                                        ? colors.blue[500]
                                        : colors.stone[400]
                                }
                            />
                        </View>
                    </View>
                </View>

                <View className="h-20" />
            </ScrollView>

            <Modal
                visible={showPinModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowPinModal(false)}
            >
                <View className="flex-1 bg-black/80 justify-end">
                    <View className="bg-stone-900 rounded-t-3xl border-t-4 border-stone-700 p-6">
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-stone-200 font-dmsans-bold text-2xl">
                                PIN Ayarla
                            </Text>
                            <TouchableOpacity onPress={() => setShowPinModal(false)}>
                                <MaterialIcons name="close" size={24} color={colors.stone[400]} />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-4">
                            <Text className="text-stone-400 font-dmsans-bold text-base mb-2">
                                PIN
                            </Text>
                            <TextInput
                                value={tempPin}
                                onChangeText={setTempPin}
                                placeholder="En az 4 karakter"
                                placeholderTextColor={colors.stone[600]}
                                secureTextEntry
                                keyboardType="numeric"
                                maxLength={8}
                                className="bg-stone-800 text-stone-200 p-4 rounded-xl border-4 border-stone-700/50 font-dmsans-medium text-lg"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-stone-400 font-dmsans-bold text-base mb-2">
                                PIN Tekrar
                            </Text>
                            <TextInput
                                value={confirmPin}
                                onChangeText={setConfirmPin}
                                placeholder="PIN'i tekrar girin"
                                placeholderTextColor={colors.stone[600]}
                                secureTextEntry
                                keyboardType="numeric"
                                maxLength={8}
                                className="bg-stone-800 text-stone-200 p-4 rounded-xl border-4 border-stone-700/50 font-dmsans-medium text-lg"
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-stone-400 font-dmsans-bold text-base mb-2">
                                İpucu (Opsiyonel)
                            </Text>
                            <TextInput
                                value={tempHint}
                                onChangeText={setTempHint}
                                placeholder="PIN'inizi hatırlamanız için ipucu"
                                placeholderTextColor={colors.stone[600]}
                                multiline
                                numberOfLines={2}
                                className="bg-stone-800 text-stone-200 p-4 rounded-xl border-4 border-stone-700/50 font-dmsans-regular text-base"
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleSavePin}
                            className="bg-green-700 p-4 rounded-xl border-4 border-green-800/50"
                        >
                            <Text className="text-white font-dmsans-bold text-lg text-center">
                                Kaydet
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Settings;