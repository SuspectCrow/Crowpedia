import React from 'react';
import { View } from 'react-native';
import { SCButton, ButtonVariant, IconName } from './C_SCButton';
import clsx from 'clsx';

export interface SelectorOption {
    key: string;
    title: string;
    icon?: IconName;
}

interface SelectorProps {
    options: SelectorOption[];
    selectedKey: string;
    onSelect: (key: string) => void;
    className?: string;
}

export const SCSelector: React.FC<SelectorProps> = ({
        options,
        selectedKey,
        onSelect,
        className
    }) => {
    const columns = Math.min(options.length, 4);
    const itemWidth = `${100 / columns}%`;

    return (
        <View
            className={clsx(
                "flex-row justify-center flex-wrap px-2 rounded-2xl bg-neutral-950",
                className
            )}
        >
            {options.map((item) => {
                const isSelected = selectedKey === item.key;

                return (
                    <View
                        key={item.key}
                        style={[{ width: itemWidth }]}
                    >
                        <SCButton
                            text={item.title}
                            icon={item.icon}
                            variant={ButtonVariant.DEFAULT}
                            transparent={!isSelected}
                            onPress={() => onSelect(item.key)}

                            className={clsx(
                                "w-full justify-center m-0 border-0 mx-0",
                                isSelected ? "bg-[#262626]" : "opacity-60 hover:opacity-100"
                            )}
                        />
                    </View>
                );
            })}
        </View>
    );
};