import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import clsx from 'clsx';
import colors from "tailwindcss/colors";

interface TimePickerProps {
    label?: string;
    value: Date;
    onChange: (date: Date) => void;
    className?: string;
    disabled?: boolean;
}

export const SCTimePicker: React.FC<TimePickerProps> = ({
                                                            label,
                                                            value,
                                                            onChange,
                                                            className,
                                                            disabled
                                                        }) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    const formattedTime = value.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return (
        <View className={clsx("self-start", className)}>

            {label && (
                <Text className="mb-1 text-base font-medium text-neutral-400 font-dmsans">
                    {label}
                </Text>
            )}

            <Pressable
                onPress={() => !disabled && setShowPicker(true)}
                disabled={disabled}
                className={clsx(
                    "flex-row items-center justify-center px-6 py-3 rounded-md border",
                    "bg-neutral-900 border-neutral-800",
                    "gap-3",
                    disabled && "opacity-50"
                )}
            >
                <MaterialIcons name="schedule" size={24} color="white" />

                <Text className="text-2xl font-normal font-dmsans tracking-widest text-white">
                    {formattedTime}
                </Text>
            </Pressable>

            {showPicker && (
                <DateTimePicker
                    value={value}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleChange}
                    themeVariant="dark"
                />
            )}
        </View>
    );
};