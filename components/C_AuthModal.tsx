import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import { authenticateWithBiometric } from '@/lib/biometricAuth';
import { getSettings } from '@/lib/settings';

interface AuthModalProps {
    visible: boolean;
    onSuccess: () => void;
    onCancel: () => void;
}

export const AuthModal = ({ visible, onSuccess, onCancel }: AuthModalProps) => {
    const [pin, setPin] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [useBiometric, setUseBiometric] = useState(true);
    const [storedPin, setStoredPin] = useState<string | null>(null);
    const [pinHint, setPinHint] = useState<string | null>(null);
    const [attemptedBiometric, setAttemptedBiometric] = useState(false);

    useEffect(() => {
        if (visible) {
            loadSettings();
            setPin('');
            setShowHint(false);
            setAttemptedBiometric(false);
        }
    }, [visible]);

    const loadSettings = async () => {
        const settings = await getSettings();
        setUseBiometric(settings.useBiometric);
        setStoredPin(settings.pin);
        setPinHint(settings.pinHint);

        if (settings.useBiometric && !attemptedBiometric) {
            setAttemptedBiometric(true);
            handleBiometricAuth();
        }
    };

    const handleBiometricAuth = async () => {
        const success = await authenticateWithBiometric();
        if (success) {
            onSuccess();
        }
    };

    const handlePinSubmit = () => {
        if (pin === storedPin) {
            onSuccess();
        } else {
            Alert.alert('Hata', 'Yanlış PIN');
            setPin('');
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onCancel}
        >
            <View className="flex-1 bg-black/90 justify-center items-center p-6">
                <View className="bg-stone-900 rounded-2xl border-4 border-stone-700 p-6 w-full max-w-md">
                    <View className="items-center mb-6">
                        <MaterialIcons name="lock" size={48} color={colors.amber[500]} />
                        <Text className="text-stone-200 font-dmsans-bold text-2xl mt-4">
                            Kimlik Doğrulama
                        </Text>
                        <Text className="text-stone-400 font-dmsans-regular text-base mt-2 text-center">
                            Şifreleri görüntülemek için kimliğinizi doğrulayın
                        </Text>
                    </View>

                    {useBiometric && !attemptedBiometric && (
                        <TouchableOpacity
                            onPress={handleBiometricAuth}
                            className="bg-green-700 p-4 rounded-xl border-4 border-green-800/50 mb-4"
                        >
                            <View className="flex-row items-center justify-center gap-2">
                                <MaterialIcons name="fingerprint" size={24} color="white" />
                                <Text className="text-white font-dmsans-bold text-lg">
                                    Parmak İzi Kullan
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    <View className="mb-4">
                        <Text className="text-stone-400 font-dmsans-bold text-base mb-2">
                            {useBiometric ? 'veya PIN Girin' : 'PIN Girin'}
                        </Text>
                        <TextInput
                            value={pin}
                            onChangeText={setPin}
                            placeholder="PIN"
                            placeholderTextColor={colors.stone[600]}
                            secureTextEntry
                            keyboardType="numeric"
                            maxLength={8}
                            onSubmitEditing={handlePinSubmit}
                            className="bg-stone-800 text-stone-200 p-4 rounded-xl border-4 border-stone-700/50 font-dmsans-medium text-lg text-center"
                        />
                    </View>

                    {pinHint && (
                        <TouchableOpacity
                            onPress={() => setShowHint(!showHint)}
                            className="mb-4"
                        >
                            <Text className="text-blue-400 font-dmsans-medium text-sm text-center">
                                {showHint ? '🔒 İpucu: ' + pinHint : '💡 İpucunu Göster'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={onCancel}
                            className="flex-1 bg-stone-700 p-4 rounded-xl border-4 border-stone-800/50"
                        >
                            <Text className="text-white font-dmsans-bold text-base text-center">
                                İptal
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handlePinSubmit}
                            className="flex-1 bg-green-700 p-4 rounded-xl border-4 border-green-800/50"
                            disabled={!pin}
                        >
                            <Text className="text-white font-dmsans-bold text-base text-center">
                                Doğrula
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};