import { ICard } from "@/interfaces/ICard";
import {
    Alert,
    Linking,
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
    ActivityIndicator,
    Switch
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { MediaCard } from "@/components/C_MediaCard";
import React, {useState, useCallback, useRef} from "react";
import colors from "tailwindcss/colors";
import { searchMedia } from "@/lib/tmdbapi";
import { updateCard } from "@/lib/appwrite";
import { MaterialIcons } from "@expo/vector-icons";
import {BackgroundSelector, BackgroundSelectorRef} from "@/components/C_CardBackgroundSelector";

const CollectionDetail = ({ card, parsedCardContent, onRefresh }: { card: ICard, parsedCardContent: any, onRefresh: () => void }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [searchType, setSearchType] = useState<'movie' | 'tv'>('movie');

    const [title, setTitle] = useState(card.title);

    const backgroundSelectorRef = useRef<BackgroundSelectorRef>(null);

    const handleSave = async () => {
        if (isEditMode){
            setIsSaving(true);
            try {
                if (backgroundSelectorRef.current) {
                    await backgroundSelectorRef.current.save();
                }

                await updateCard(card.$id, {
                    title: title
                });

                card.title = title;

                onRefresh();

                setIsEditMode(false);

            } catch (error) {
                console.error("Ekleme hatası:", error);
                Alert.alert("Hata", "Görev güncellenirken bir sorun oluştu.");
            } finally {
                setIsSaving(false);
            }
        } else {
            setIsEditMode(true);
        }
    }

    const handleMediaPress = async (mediaItem: any) => {
        if (!mediaItem?.metadata?.fragman) {
            Alert.alert("Hata", "Fragman linki bulunamadı.");
            return;
        }

        let targetUrl = mediaItem.metadata.fragman.trim();
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }

        try {
            const supported = await Linking.canOpenURL(targetUrl);
            if (supported) {
                await Linking.openURL(targetUrl);
            } else {
                Alert.alert("Hata", `Bu link açılamıyor: ${targetUrl}`);
            }
        } catch (error) {
            Alert.alert("Hata", "Link açılırken bir sorun oluştu.");
        }
    };

    const handleMediaLongPress = (mediaItem: any) => {
        setSelectedMedia(mediaItem);
    };

    const handleDeleteMedia = async (externalId: string) => {
        Alert.alert(
            "Film Sil",
            "Bu filmi listeden silmek istediğinize emin misiniz?",
            [
                { text: "İptal", style: "cancel" },
                {
                    text: "Sil",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setIsSaving(true);
                            const updatedItems = parsedCardContent.items.filter(
                                (item: any) => item.externalId !== externalId
                            );
                            const updatedContent = {
                                ...parsedCardContent,
                                items: updatedItems
                            };
                            await updateCard(card.$id, { content: JSON.stringify(updatedContent) });
                            onRefresh();
                        } catch (error) {
                            Alert.alert("Hata", "Film silinirken bir hata oluştu.");
                        } finally {
                            setIsSaving(false);
                        }
                    }
                }
            ]
        );
    };

    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const results = await searchMedia(query, searchType);
            setSearchResults(results?.results || []);
        } catch (error) {
            Alert.alert("Hata", "Arama sırasında bir hata oluştu.");
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [searchType]);

    const handleAddMedia = async (item: any) => {
        try {
            setIsSaving(true);

            const title = item.title || item.name;
            const originalTitle = item.original_title || item.original_name;
            const releaseDate = item.release_date || item.first_air_date;

            const currentMediaType = searchType;

            if (!title) {
                setIsSaving(false);
                return;
            }

            const newItem = {
                externalId: `${currentMediaType}-${item.id}`,
                metadata: {
                    title: title || originalTitle,
                    media_type: currentMediaType,
                    background: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : "",
                    poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
                    overview: item.overview || "",
                    rating: item.vote_average || 0,
                    release_date: releaseDate || "",
                    fragman: ""
                },
                rating: 0
            };

            const existingItem = parsedCardContent.items.find(
                (item: any) => item.externalId === newItem.externalId
            );

            if (existingItem) {
                Alert.alert("Uyarı", "Bu içerik zaten listede mevcut!");
                return;
            }

            const updatedItems = [...parsedCardContent.items, newItem];
            const updatedContent = { ...parsedCardContent, items: updatedItems };

            await updateCard(card.$id, { content: JSON.stringify(updatedContent) });

            setIsAddMode(false);
            setSearchQuery("");
            setSearchResults([]);
            onRefresh();
            Alert.alert("Başarılı", "Listeye eklendi!");

        } catch (error) {
            Alert.alert("Hata", "Ekleme sırasında hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!parsedCardContent || !parsedCardContent.items || !Array.isArray(parsedCardContent.items)) {
        return (
            <View className="p-4">
                <Text className="text-white text-center font-dmsans-medium text-lg">
                    Koleksiyon içeriği bulunamadı
                </Text>
            </View>
        );
    }

    const mediaItems = parsedCardContent.items;

    return (
        <View className="flex-1">
            <FlashList
                data={mediaItems}
                numColumns={2}
                renderItem={({ item, index } : any) => (
                    <View className="relative">
                        <MediaCard
                            card={card}
                            mediaItem={item}
                            onPress={() => !isEditMode && handleMediaPress(item)}
                            onLongPress={() => handleMediaLongPress(item)}
                        />
                        {isEditMode && (
                            <TouchableOpacity
                                className="absolute top-3 right-3 bg-red-600 rounded-md p-1 z-10"
                                onPress={() => handleDeleteMedia(item.externalId)}
                            >
                                <MaterialIcons name={"delete"} size={24} style={{ color: 'white' }}/>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                keyExtractor={(item : any, index) => `${item.externalId}-${index}`}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View className="px-2 py-3">
                        <View className="flex-row items-center justify-center gap-3">
                            {
                                isEditMode ? (
                                    <TextInput
                                        value={title}
                                        onChangeText={setTitle}
                                        placeholder="Enter a title"
                                        className="text-2xl font-dmsans-bold text-stone-600 text-center"
                                    ></TextInput>
                                ) : (
                                    <Text className="text-2xl font-dmsans-bold text-stone-400 text-center">
                                        {title}
                                    </Text>
                                )
                            }
                            <TouchableOpacity
                                onPress={() => handleSave()}
                                className= {`${isEditMode ? "bg-green-600" : "bg-stone-700"} rounded-lg p-2`}
                            >
                                <MaterialIcons size={24} name={isEditMode ? "save" : "edit-note"} className="size-6" style={{ color: colors.stone["300"] }}/>
                            </TouchableOpacity>
                        </View>

                        { isEditMode && (
                            <BackgroundSelector ref={backgroundSelectorRef} card={card} />
                        ) }

                        <Text className="text-sm font-dmsans-regular text-stone-500 text-center mt-1">
                            {mediaItems.length} film
                        </Text>
                    </View>
                }
                contentContainerStyle={{
                    paddingHorizontal: 4,
                    paddingBottom: 100,
                }}
            />

            <TouchableOpacity onPress={() => setIsAddMode(true)}
                className="absolute bottom-6 right-6 bg-stone-600 rounded-full p-4">
                <MaterialIcons name={"add"} size={32} style={{ color: 'white' }}/>
            </TouchableOpacity>

            <Modal
                visible={selectedMedia !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedMedia(null)}
            >
                <TouchableOpacity
                    className="flex-1 bg-black/80 justify-center items-center p-6"
                    activeOpacity={1}
                    onPress={() => setSelectedMedia(null)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        className="bg-stone-800 rounded-2xl p-6 w-full max-w-md border-4 border-stone-700"
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View className="flex-row items-start gap-4 mb-4">
                            {selectedMedia?.metadata?.poster && (
                                <Image
                                    source={{ uri: selectedMedia.metadata.poster }}
                                    className="w-24 h-36 rounded-lg"
                                    resizeMode="cover"
                                />
                            )}
                            <View className="flex-1">
                                <Text className="text-white font-dmsans-bold text-xl mb-2">
                                    {selectedMedia?.metadata?.title}
                                </Text>
                                {selectedMedia?.metadata?.release_date && (
                                    <Text className="text-stone-400 font-dmsans-regular text-sm mb-2">
                                        {new Date(selectedMedia.metadata.release_date).getFullYear()}
                                    </Text>
                                )}
                                {selectedMedia?.metadata?.rating > 0 && (
                                    <View className="flex-row items-center gap-1">
                                        <MaterialIcons name={"star"} size={18} style={{ color: colors.yellow["400"] }}/>
                                        <Text className="text-white font-dmsans-medium text-base">
                                            {selectedMedia.metadata.rating.toFixed(1)}/10
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {selectedMedia?.metadata?.overview && (
                            <View className="mb-4">
                                <Text className="text-stone-300 font-dmsans-regular text-base leading-6">
                                    {selectedMedia.metadata.overview}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={() => setSelectedMedia(null)}
                            className="bg-stone-600 rounded-lg p-3 mt-2"
                        >
                            <Text className="text-white font-dmsans-bold text-center text-base">
                                Kapat
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal
                visible={isAddMode}
                transparent
                animationType="slide"
                onRequestClose={() => setIsAddMode(false)}
            >
                <View className="flex-1 bg-stone-900">
                    <View className="flex-row items-center justify-between p-4 border-b-2 border-stone-700">
                        <Text className="text-white font-dmsans-bold text-xl">Film Ekle</Text>
                        <TouchableOpacity onPress={() => {
                            setIsAddMode(false);
                            setSearchQuery("");
                            setSearchResults([]);
                        }}>
                            <MaterialIcons name={"close"} size={32} style={{ color: colors.stone["400"] }}/>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center justify-center py-4 bg-stone-900 border-b border-stone-800">
                        <Text className={`font-dmsans-bold text-base mr-3 ${searchType === 'tv' ? 'text-white' : 'text-stone-500'}`}>
                            Dizi
                        </Text>

                        <Switch
                            trackColor={{ false: "#44403c", true: "#44403c" }}
                            thumbColor={searchType === 'movie' ? "#16a34a" : "#dc2626"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(value) => {
                                const newType = value ? 'movie' : 'tv';
                                setSearchType(newType);
                                setSearchResults([]);
                                setSearchQuery("");
                            }}
                            value={searchType === 'movie'}
                        />

                        <Text className={`font-dmsans-bold text-base ml-3 ${searchType === 'movie' ? 'text-white' : 'text-stone-500'}`}>
                            Film
                        </Text>
                    </View>

                    <View className="p-4">
                        <View className="flex-row items-center bg-stone-800 rounded-lg px-4 py-3 border-2 border-stone-700">
                            <MaterialIcons name={"search"} className="size-6 mr-3" style={{ color: colors.stone["400"] }}/>
                            <TextInput
                                className="flex-1 text-white font-dmsans-regular text-base"
                                placeholder="Film ara..."
                                placeholderTextColor={colors.stone["500"]}
                                value={searchQuery}
                                onChangeText={(text) => {
                                    setSearchQuery(text);
                                    handleSearch(text);
                                }}
                                autoFocus
                            />
                        </View>
                    </View>

                    {isSearching ? (
                        <View className="flex-1 justify-center items-center">
                            <ActivityIndicator size="large" color={colors.stone["400"]} />
                        </View>
                    ) : (
                        <FlashList
                            data={searchResults}
                            renderItem={({ item }) => {
                                const displayTitle = searchType === 'movie' ? item.title : item.name;
                                const displayDate = searchType === 'movie' ? item.release_date : item.first_air_date;

                                if (!displayTitle) return null;

                                return (
                                    <TouchableOpacity
                                        className="flex-row p-4 bg-stone-800 m-2 rounded-lg border-2 border-stone-700"
                                        onPress={() => handleAddMedia(item)}
                                        disabled={isSaving}
                                    >
                                        {item.poster_path ? (
                                            <Image
                                                source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster_path}` }}
                                                className="w-16 h-24 rounded-md mr-3"
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View className="w-16 h-24 rounded-md mr-3 bg-stone-700 justify-center items-center">
                                                <MaterialIcons name="movie" size={24} color="#78716c" />
                                            </View>
                                        )}

                                        <View className="flex-1">
                                            <Text className="text-white font-dmsans-bold text-base mb-1">
                                                {displayTitle}
                                            </Text>

                                            {displayDate && (
                                                <Text className="text-stone-400 font-dmsans-regular text-sm mb-2">
                                                    {new Date(displayDate).getFullYear()}
                                                </Text>
                                            )}

                                            {item.vote_average > 0 && (
                                                <View className="flex-row items-center gap-1">
                                                    <MaterialIcons name={"star"} className="size-4" style={{ color: colors.yellow["400"] }}/>
                                                    <Text className="text-stone-300 font-dmsans-medium text-sm">
                                                        {item.vote_average.toFixed(1)}
                                                    </Text>

                                                    {item.media_type === 'tv' && (
                                                        <View className="bg-stone-600 px-1.5 py-0.5 rounded ml-2">
                                                            <Text className="text-stone-300 text-[10px] font-bold">TV</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                searchQuery.trim() ? (
                                    <View className="p-8">
                                        <Text className="text-stone-400 text-center font-dmsans-regular text-base">
                                            Sonuç bulunamadı
                                        </Text>
                                    </View>
                                ) : (
                                    <View className="p-8">
                                        <Text className="text-stone-400 text-center font-dmsans-regular text-base">
                                            Film aramak için yazmaya başlayın
                                        </Text>
                                    </View>
                                )
                            }
                        />
                    )}
                </View>
            </Modal>

            {isSaving && (
                <View className="absolute inset-0 bg-black/50 justify-center items-center">
                    <ActivityIndicator size="large" color="white" />
                </View>
            )}
        </View>
    );
};

export default CollectionDetail;