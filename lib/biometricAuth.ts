import * as LocalAuthentication from 'expo-local-authentication';

export const checkBiometricAvailability = async (): Promise<{
    available: boolean;
    type: string | null;
}> => {
    try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
            return { available: false, type: null };
        }

        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
            return { available: true, type: 'fingerprint' };
        }
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
            return { available: true, type: 'face' };
        }
        if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
            return { available: true, type: 'iris' };
        }

        return { available: false, type: null };
    } catch (error) {
        console.error('Biometric check error:', error);
        return { available: false, type: null };
    }
};

export const authenticateWithBiometric = async (): Promise<boolean> => {
    try {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Kimliğinizi Doğrulayın',
            cancelLabel: 'İptal',
            disableDeviceFallback: true,
        });

        return result.success;
    } catch (error) {
        console.error('Biometric auth error:', error);
        return false;
    }
};