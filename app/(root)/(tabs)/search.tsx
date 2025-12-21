import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import { getCards } from '@/lib/appwrite';
import { ICard } from '@/interfaces/ICard';
import { FlashList } from '@shopify/flash-list';
import { LargeCard, SmallCard } from '@/components/C_Card';
import { router } from 'expo-router';
import { getCardIcon } from '@/constants/card_info';

const CARD_TYPES = [
    { id: 'All', label: 'Tümü', icon: 'apps' },
    { id: 'Folder', label: 'Klasör', icon: 'folder' },
    { id: 'Note', label: 'Not', icon: 'note' },
    { id: 'Link', label: 'Link', icon: 'link' },
    { id: 'SimpleTask', label: 'Basit Görev', icon: 'task-alt' },
    { id: 'TaskList', label: 'Görev Listesi', icon: 'checklist' },
    { id: 'Objective', label: 'Hedef', icon: 'insert-chart-outlined' },
    { id: 'Event', label: 'Etkinlik', icon: 'event' },
    { id: 'Collection', label: 'Koleksiyon', icon: 'collections-bookmark' },
    { id: 'Password', label: 'Şifre', icon: 'password' },
];

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<string[]>(['All']);
    const [searchResults, setSearchResults] = useState<ICard[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setHasSearched(false);
            return;
        }

        setLoading(true);
        setHasSearched(true);

        try {
            // Tüm kartları çek ve client-side filtrele
            const allCards = await getCards({
                filter: selectedTypes.includes('All') ? '' : selectedTypes[0],
                query: '',
                limit: 500
            });

            const searchLower = searchQuery.toLowerCase().trim();
            const filtered = (allCards as unknown as ICard[]).filter(card => {
                const titleMatch = card.title?.toLowerCase().includes(searchLower);
                const contentMatch = card.content?.toLowerCase().includes(searchLower);
                const typeMatch = selectedTypes.includes('All') || selectedTypes.includes(card.type || '');

                return (titleMatch || contentMatch) && typeMatch;
            });

            setSearchResults(filtered);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedTypes]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setHasSearched(false);
            return;
        }

        const delaySearch = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchQuery, handleSearch]);

    const toggleType = (typeId: string) => {
        if (typeId === 'All') {
            setSelectedTypes(['All']);
        } else {
            setSelectedTypes(prev => {
                const filtered = prev.filter(t => t !== 'All');

                if (filtered.includes(typeId)) {
                    const newTypes = filtered.filter(t => t !== typeId);
                    return newTypes.length === 0 ? ['All'] : newTypes;
                } else {
                    return [...filtered, typeId];
                }
            });
        }
    };

    const handleCardPress = async (card: ICard) => {
        switch (card.type) {
            case 'Link':
                try {
                    const { Linking } = await import('react-native');
                    await Linking.openURL(card.content);
                } catch (error) {
                    console.error('Link open error:', error);
                }
                break;
            case 'SimpleTask':
                const { updateCard } = await import('@/lib/appwrite');
                try {
                    await updateCard(card.$id, {
                        content: String(!(card.content === "true"))
                    });
                    handleSearch();
                } catch (error) {
                    console.error('Update error:', error);
                }
                break;
            default:
                router.push(`/card/detail/${card.$id}`);
                break;
        }
    };

    const handleCardLongPress = (cardId: string) => {
        router.push(`/card/detail/${cardId}`);
    };

    return (
        <SafeAreaView className="flex-1 px-4 pt-2" style={{ backgroundColor: '#292524' }}>
            <View className="mb-4">
                <View className="flex-row items-center bg-stone-800 rounded-xl px-4 py-3 border-4 border-stone-700/50">
                    <MaterialIcons name="search" size={24} color={colors.stone[400]} />
                    <TextInput
                        className="flex-1 ml-3 text-stone-200 font-dmsans-regular text-lg"
                        placeholder="Kartlarda ara..."
                        placeholderTextColor={colors.stone[500]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <MaterialIcons name="close" size={20} color={colors.stone[400]} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View className="mb-4">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8 }}
                >
                    {CARD_TYPES.map((type) => {
                        const isSelected = selectedTypes.includes(type.id);
                        return (
                            <TouchableOpacity
                                key={type.id}
                                onPress={() => toggleType(type.id)}
                                className={`flex-row items-center gap-2 px-3 py-2 rounded-full border-2 ${
                                    isSelected
                                        ? 'bg-amber-600 border-amber-500'
                                        : 'bg-stone-800 border-stone-700'
                                }`}
                            >
                                <MaterialIcons
                                    name={type.icon as any}
                                    size={18}
                                    color={isSelected ? 'white' : colors.stone[400]}
                                />
                                <Text
                                    className={`font-dmsans-medium text-sm ${
                                        isSelected ? 'text-white' : 'text-stone-400'
                                    }`}
                                >
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.amber[500]} />
                    <Text className="text-stone-400 font-dmsans-medium text-base mt-4">
                        Aranıyor...
                    </Text>
                </View>
            ) : searchResults.length > 0 ? (
                <View className="flex-1">
                    <View className="mb-3 px-2">
                        <Text className="text-stone-400 font-dmsans-medium text-sm">
                            {searchResults.length} sonuç bulundu
                        </Text>
                    </View>
                    <FlashList
                        data={searchResults}
                        numColumns={2}
                        masonry
                        renderItem={({ item }) =>
                            item.isLarge ? (
                                <LargeCard
                                    card={item}
                                    onPress={() => handleCardPress(item)}
                                    onLongPress={() => handleCardLongPress(item.$id)}
                                />
                            ) : (
                                <SmallCard
                                    card={item}
                                    onPress={() => handleCardPress(item)}
                                    onLongPress={() => handleCardLongPress(item.$id)}
                                />
                            )
                        }
                        keyExtractor={(item) => item.$id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            ) : hasSearched ? (
                <View className="flex-1 items-center justify-center p-8">
                    <MaterialIcons name="search-off" size={64} color={colors.stone[600]} />
                    <Text className="text-stone-500 font-dmsans-bold text-xl mt-4 text-center">
                        Sonuç Bulunamadı
                    </Text>
                    <Text className="text-stone-600 font-dmsans-regular text-base mt-2 text-center">
                        {searchQuery.trim()
                            ? `"${searchQuery}" için sonuç bulunamadı`
                            : 'Seçilen filtrelere uygun kart bulunamadı'
                        }
                    </Text>
                </View>
            ) : (
                <View className="flex-1 items-center justify-center p-8">
                    <MaterialIcons name="search" size={64} color={colors.stone[600]} />
                    <Text className="text-stone-500 font-dmsans-bold text-xl mt-4 text-center">
                        Arama Yapmaya Başlayın
                    </Text>
                    <Text className="text-stone-600 font-dmsans-regular text-base mt-2 text-center">
                        Kartlarınızı aramak için yukarıdaki arama kutusunu kullanın veya filtrelerden seçim yapın
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Search;