import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {FlashList} from '@shopify/flash-list';
import {ICard, CardVariant} from '@/interfaces/ICard';
import {LargeCard, SmallCard} from '@/components/C_Card';
import {getCardIcon} from '@/constants/card_info';
import colors from 'tailwindcss/colors';

interface CardTypeWrapperProps {
    type: string;
    cards: ICard[];
    onCardPress: (id: string) => void;
    onCardLongPress: (id: string) => void;
    defaultExpanded?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
    'Note': 'Notlar',
    'Link': 'Bağlantılar',
    'SimpleTask': 'Basit Görevler',
    'TaskList': 'Görev Listeleri',
    'Objective': 'Hedefler',
    'Event': 'Etkinlikler',
    'Collection': 'Koleksiyonlar',
    'Routine': 'Rutinler',
    'Password': 'Şifreler',
};

export const CardTypeWrapper = ({
                                    type,
                                    cards,
                                    onCardPress,
                                    onCardLongPress,
                                    defaultExpanded = true
                                }: CardTypeWrapperProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    if (cards.length === 0) return null;

    const typeLabel = TYPE_LABELS[type] || type;
    const typeIcon = getCardIcon(type);

    return (
        <View
            style={{
                backgroundColor: '#1c1917',
                borderRadius: 12,
                marginHorizontal: 6,
                marginTop: 12,
                borderColor: '#0c0a09',
                borderWidth: 4,
            }}
        >
            <TouchableOpacity
                className="flex-row items-center justify-between p-4"
                onPress={() => setIsExpanded(!isExpanded)}
                activeOpacity={0.7}
            >
                <View className="flex-row items-center gap-3">
                    <MaterialIcons
                        name={typeIcon as any}
                        size={24}
                        color={colors.stone[400]}
                    />
                    <Text className="text-xl font-dmsans-bold text-stone-400">
                        {typeLabel}
                    </Text>
                    <View className="bg-stone-700 px-2 py-1 rounded-full">
                        <Text className="text-stone-300 font-dmsans-medium text-sm">
                            {cards.length}
                        </Text>
                    </View>
                </View>

                <MaterialIcons
                    name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={28}
                    color={colors.stone[500]}
                />
            </TouchableOpacity>

            {isExpanded && (
                <View className="px-2 pb-2">
                    <FlashList
                        data={cards}
                        numColumns={2}
                        masonry
                        renderItem={({item}) => {
                            const commonProps = {
                                card: item,
                                onPress: () => onCardPress(item.$id),
                                onLongPress: () => onCardLongPress(item.$id),
                            };

                            switch (item.variant) {
                                case CardVariant.LARGE:
                                    return <LargeCard {...commonProps} />;
                                case CardVariant.SMALL:
                                default:
                                    return <SmallCard {...commonProps} />;
                            }
                        }}
                        keyExtractor={(item) => item.$id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </View>
    );
};