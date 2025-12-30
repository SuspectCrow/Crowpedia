import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import clsx from 'clsx';
import colors from "tailwindcss/colors";

interface DatePickerProps {
    label?: string;
    value: Date;
    onChange: (date: Date) => void;
    className?: string;
    disabled?: boolean;
}

export const SCDatePicker: React.FC<DatePickerProps> = ({
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

    const formattedDate = value.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const formattedDay = value.toLocaleDateString('en-GB', {
        weekday: 'long',
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
                    "flex-row items-center px-4 h-16 rounded-md border gap-4",
                    "bg-neutral-900 border-neutral-800",
                    disabled && "opacity-50"
                )}
            >
                <MaterialIcons name="calendar-today" size={24} color="white" />

                <View className="items-end justify-center">
                    <Text className="text-lg font-medium font-dmsans text-white">
                        {formattedDate}
                    </Text>
                    <Text className="text-neutral-400 text-sm font-dmsans">
                        {formattedDay}
                    </Text>
                </View>
            </Pressable>

            {showPicker && (
                <DateTimePicker
                    value={value}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleChange}
                    themeVariant="dark"
                    accentColor={colors.neutral['500']}
                />
            )}
        </View>
    );
};