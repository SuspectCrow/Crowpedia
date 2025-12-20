import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
    useBiometric: boolean;
    pin: string | null;
    pinHint: string | null;
    theme: 'light' | 'dark';
}

const SETTINGS_KEY = '@app_settings';

const DEFAULT_SETTINGS: AppSettings = {
    useBiometric: true,
    pin: null,
    pinHint: null,
    theme: 'dark',
};

export const getSettings = async (): Promise<AppSettings> => {
    try {
        const stored = await AsyncStorage.getItem(SETTINGS_KEY);
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
        return DEFAULT_SETTINGS;
    } catch (error) {
        console.error('Settings load error:', error);
        return DEFAULT_SETTINGS;
    }
};

export const saveSettings = async (settings: Partial<AppSettings>): Promise<void> => {
    try {
        const current = await getSettings();
        const updated = { ...current, ...settings };
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Settings save error:', error);
        throw error;
    }
};

export const resetSettings = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(SETTINGS_KEY);
    } catch (error) {
        console.error('Settings reset error:', error);
        throw error;
    }
};