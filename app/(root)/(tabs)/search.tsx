import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import { getCards } from '@/lib/appwrite';
import { ICard, CardVariant } from '@/interfaces/ICard';
import { FlashList } from '@shopify/flash-list';
import { DetailedCard, LargeCard, MasonryCard, SmallCard } from '@/components/C_Card';
import { router } from 'expo-router';

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

const SORT_OPTIONS = [
    { id: 'createdDesc', label: 'Oluşturulma (Yeni)', icon: 'new-releases' },
    { id: 'createdAsc', label: 'Oluşturulma (Eski)', icon: 'history' },
    { id: 'updatedDesc', label: 'Değiştirilme (Yeni)', icon: 'update' },
    { id: 'updatedAsc', label: 'Değiştirilme (Eski)', icon: 'access-time' },
    { id: 'eventDate', label: 'Etkinlik Tarihi', icon: 'event' },
    { id: 'objectiveEnd', label: 'Hedef Bitiş', icon: 'flag' },
];

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<string[]>(['All']);
    const [selectedSort, setSelectedSort] = useState('createdDesc');
    const [cards, setCards] = useState<ICard[]>([]);
    const [loading, setLoading] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const loadCards = useCallback(async () => {
        setLoading(true);
        setShowTypeDropdown(false);
        setShowSortDropdown(false);
        try {
            const isAllSelected = selectedTypes.includes('All');
            const filter = isAllSelected ? '' : selectedTypes[0] || '';
            const results = await getCards({
                filter,
                query: '',
                limit: 500
            });

            let sortedCards = results as unknown as ICard[];

            // Çoklu tip filtrelemesi (All seçili değilse)
            if (!isAllSelected && selectedTypes.length > 0) {
                sortedCards = sortedCards.filter(card =>
                    selectedTypes.includes(card.type || '')
                );
            }

            // Sıralama işlemleri
            sortedCards = sortedCards.sort((a, b) => {
                switch (selectedSort) {
                    case 'createdDesc':
                        return new Date(b.$createdAt || 0).getTime() - new Date(a.$createdAt || 0).getTime();
                    case 'createdAsc':
                        return new Date(a.$createdAt || 0).getTime() - new Date(b.$createdAt || 0).getTime();
                    case 'updatedDesc':
                        return new Date(b.$updatedAt || 0).getTime() - new Date(a.$updatedAt || 0).getTime();
                    case 'updatedAsc':
                        return new Date(a.$updatedAt || 0).getTime() - new Date(b.$updatedAt || 0).getTime();
                    case 'eventDate':
                        if (a.type === 'Event' && b.type === 'Event') {
                            try {
                                const aContent = JSON.parse(a.content || '{}');
                                const bContent = JSON.parse(b.content || '{}');
                                const aTime = parseInt(aContent.timestamp || '0');
                                const bTime = parseInt(bContent.timestamp || '0');
                                return aTime - bTime;
                            } catch {
                                return 0;
                            }
                        }
                        if (a.type === 'Event') return -1;
                        if (b.type === 'Event') return 1;
                        return 0;
                    case 'objectiveEnd':
                        if (a.type === 'Objective' && b.type === 'Objective') {
                            try {
                                const aContent = JSON.parse(a.content || '{}');
                                const bContent = JSON.parse(b.content || '{}');
                                const aTime = parseInt(aContent.enddate || '0');
                                const bTime = parseInt(bContent.enddate || '0');
                                return aTime - bTime;
                            } catch {
                                return 0;
                            }
                        }
                        if (a.type === 'Objective') return -1;
                        if (b.type === 'Objective') return 1;
                        return 0;
                    default:
                        return 0;
                }
            });

            setCards(sortedCards);
        } catch (error) {
            console.error('Load cards error:', error);
            setCards([]);
        } finally {
            setLoading(false);
        }
    }, [selectedTypes, selectedSort]);

    useEffect(() => {
        loadCards();
    }, [loadCards]);

    const filteredCards = cards.filter(card => {
        if (!searchQuery.trim()) return true;
        const searchLower = searchQuery.toLowerCase();
        return card.title?.toLowerCase().includes(searchLower) ||
            card.content?.toLowerCase().includes(searchLower);
    });

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
                    loadCards();
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

    const getAvailableSortOptions = () => {
        const hasEvent = selectedTypes.includes('Event') || selectedTypes.includes('All');
        const hasObjective = selectedTypes.includes('Objective') || selectedTypes.includes('All');

        let options = ['createdDesc', 'createdAsc', 'updatedDesc', 'updatedAsc'];

        if (hasEvent) options.push('eventDate');
        if (hasObjective) options.push('objectiveEnd');

        return SORT_OPTIONS.filter(opt => options.includes(opt.id));
    };

    const availableSorts = getAvailableSortOptions();

    useEffect(() => {
        if (!availableSorts.find(opt => opt.id === selectedSort)) {
            setSelectedSort('createdDesc');
        }
    }, [selectedTypes]);

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

    const getTypeButtonLabel = () => {
        if (selectedTypes.includes('All')) {
            return 'Tümü';
        }
        if (selectedTypes.length === 1) {
            return CARD_TYPES.find(t => t.id === selectedTypes[0])?.label || 'Filtre';
        }
        return `${selectedTypes.length} Tür`;
    };

    const getTypeButtonIcon = () => {
        if (selectedTypes.includes('All')) {
            return 'apps';
        }
        if (selectedTypes.length === 1) {
            return CARD_TYPES.find(t => t.id === selectedTypes[0])?.icon || 'filter-list';
        }
        return 'filter-list';
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

            <View className="flex-row gap-3 mb-4">
                <TouchableOpacity
                    onPress={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="flex-1 flex-row items-center justify-between bg-stone-800 rounded-xl px-4 py-3 border-4 border-stone-700/50"
                >
                    <View className="flex-row items-center gap-2">
                        <MaterialIcons
                            name={getTypeButtonIcon() as any}
                            size={20}
                            color={colors.amber[500]}
                        />
                        <Text className="text-stone-300 font-dmsans-medium text-base" numberOfLines={1}>
                            {getTypeButtonLabel()}
                        </Text>
                    </View>
                    <MaterialIcons
                        name={showTypeDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={24}
                        color={colors.stone[400]}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex-1 flex-row items-center justify-between bg-stone-800 rounded-xl px-4 py-3 border-4 border-stone-700/50"
                >
                    <View className="flex-row items-center gap-2">
                        <MaterialIcons
                            name={availableSorts.find(s => s.id === selectedSort)?.icon as any}
                            size={20}
                            color={colors.blue[500]}
                        />
                        <Text className="text-stone-300 font-dmsans-medium text-sm" numberOfLines={1}>
                            {availableSorts.find(s => s.id === selectedSort)?.label}
                        </Text>
                    </View>
                    <MaterialIcons
                        name={showSortDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={24}
                        color={colors.stone[400]}
                    />
                </TouchableOpacity>
            </View>

            {showTypeDropdown && (
                <View className="bg-stone-800 rounded-xl border-4 border-stone-700/50 mb-4 overflow-hidden">
                    <ScrollView style={{ maxHeight: 300 }}>
                        {CARD_TYPES.map((type, index) => {
                            const isSelected = selectedTypes.includes(type.id);
                            return (
                                <TouchableOpacity
                                    key={type.id}
                                    onPress={() => toggleType(type.id)}
                                    className={`flex-row items-center gap-3 px-4 py-3 ${
                                        index !== CARD_TYPES.length - 1 ? 'border-b border-stone-700/30' : ''
                                    } ${isSelected ? 'bg-amber-900/20' : ''}`}
                                >
                                    <View className={`w-6 h-6 rounded border-2 items-center justify-center ${
                                        isSelected ? 'bg-amber-600 border-amber-500' : 'border-stone-600'
                                    }`}>
                                        {isSelected && (
                                            <MaterialIcons name="check" size={16} color="white" />
                                        )}
                                    </View>
                                    <MaterialIcons
                                        name={type.icon as any}
                                        size={22}
                                        color={isSelected ? colors.amber[500] : colors.stone[400]}
                                    />
                                    <Text
                                        className={`font-dmsans-medium text-base ${
                                            isSelected ? 'text-amber-500' : 'text-stone-300'
                                        }`}
                                    >
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

            {showSortDropdown && (
                <View className="bg-stone-800 rounded-xl border-4 border-stone-700/50 mb-4 overflow-hidden">
                    <ScrollView style={{ maxHeight: 300 }}>
                        {availableSorts.map((sort, index) => (
                            <TouchableOpacity
                                key={sort.id}
                                onPress={() => {
                                    setSelectedSort(sort.id);
                                    setShowSortDropdown(false);
                                }}
                                className={`flex-row items-center gap-3 px-4 py-3 ${
                                    index !== availableSorts.length - 1 ? 'border-b border-stone-700/30' : ''
                                } ${selectedSort === sort.id ? 'bg-blue-900/20' : ''}`}
                            >
                                <MaterialIcons
                                    name={sort.icon as any}
                                    size={22}
                                    color={selectedSort === sort.id ? colors.blue[500] : colors.stone[400]}
                                />
                                <Text
                                    className={`font-dmsans-medium text-base ${
                                        selectedSort === sort.id ? 'text-blue-500' : 'text-stone-300'
                                    }`}
                                >
                                    {sort.label}
                                </Text>
                                {selectedSort === sort.id && (
                                    <MaterialIcons
                                        name="check"
                                        size={20}
                                        color={colors.blue[500]}
                                        style={{ marginLeft: 'auto' }}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.amber[500]} />
                    <Text className="text-stone-400 font-dmsans-medium text-base mt-4">
                        Yükleniyor...
                    </Text>
                </View>
            ) : filteredCards.length > 0 ? (
                <View className="flex-1">
                    <View className="mb-3 px-2">
                        <Text className="text-stone-400 font-dmsans-medium text-sm">
                            {filteredCards.length} kart bulundu
                        </Text>
                    </View>
                    <FlashList
                        data={filteredCards}
                        numColumns={2}
                        masonry
                        renderItem={({ item }) => {
                            const commonProps = {
                                card: item,
                                onPress: () => handleCardPress(item),
                                onLongPress: () => handleCardLongPress(item.$id),
                            };

                            switch (item.variant) {
                                case CardVariant.LARGE:
                                    return <LargeCard {...commonProps} />;
                                case CardVariant.MASONRY:
                                    return <MasonryCard {...commonProps} />;
                                case CardVariant.DETAILED:
                                    return <DetailedCard {...commonProps} />;
                                case CardVariant.SMALL:
                                default:
                                    return <SmallCard {...commonProps} />;
                            }
                        }}
                        keyExtractor={(item) => item.$id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            ) : (
                <View className="flex-1 items-center justify-center p-8">
                    <MaterialIcons name="inbox" size={64} color={colors.stone[600]} />
                    <Text className="text-stone-500 font-dmsans-bold text-xl mt-4 text-center">
                        Kart Bulunamadı
                    </Text>
                    <Text className="text-stone-600 font-dmsans-regular text-base mt-2 text-center">
                        {searchQuery.trim()
                            ? `"${searchQuery}" için sonuç bulunamadı`
                            : selectedTypes.includes('All')
                                ? 'Henüz hiç kart oluşturulmamış'
                                : `Seçilen türlerde kart bulunamadı`
                        }
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Search;