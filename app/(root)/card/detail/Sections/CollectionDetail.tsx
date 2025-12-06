import { ICard } from "@/interfaces/ICard";
import { Alert, Linking, View, Text, TouchableOpacity, Image, Modal, TextInput, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { MovieCard } from "@/components/C_MovieCard";
import { useState, useCallback } from "react";
import icons from "@/constants/icons";
import colors from "tailwindcss/colors";
import { searchMovies } from "@/lib/tmdbapi";
import { updateCard } from "@/lib/appwrite";

const CollectionDetail = ({ card, parsedCardContent, onRefresh }: { card: ICard, parsedCardContent: any, onRefresh: () => void }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleMoviePress = async (movieItem: any) => {
        if (!movieItem?.metadata?.fragman) {
            Alert.alert("Hata", "Fragman linki bulunamadı.");
            return;
        }

        let targetUrl = movieItem.metadata.fragman.trim();
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

    const handleMovieLongPress = (movieItem: any) => {
        setSelectedMovie(movieItem);
    };

    const handleDeleteMovie = async (externalId: string) => {
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
            const results = await searchMovies(query);
            setSearchResults(results?.results || []);
        } catch (error) {
            Alert.alert("Hata", "Arama sırasında bir hata oluştu.");
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleAddMovie = async (movie: any) => {
        try {
            setIsSaving(true);

            const newItem = {
                externalId: `${movie.id}-${movie.title.toLowerCase().replace(/\s+/g, '-')}`,
                metadata: {
                    title: movie.title || movie.original_title,
                    background: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "",
                    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
                    overview: movie.overview || "",
                    rating: movie.vote_average || 0,
                    release_date: movie.release_date || "",
                    fragman: ""
                },
                rating: 0
            };

            const existingItem = parsedCardContent.items.find(
                (item: any) => item.externalId === newItem.externalId
            );

            if (existingItem) {
                Alert.alert("Uyarı", "Bu film zaten listede mevcut!");
                return;
            }

            const updatedItems = [...parsedCardContent.items, newItem];
            const updatedContent = {
                ...parsedCardContent,
                items: updatedItems
            };

            await updateCard(card.$id, { content: JSON.stringify(updatedContent) });

            setIsAddMode(false);
            setSearchQuery("");
            setSearchResults([]);
            onRefresh();

            Alert.alert("Başarılı", "Film listeye eklendi!");
        } catch (error) {
            Alert.alert("Hata", "Film eklenirken bir hata oluştu.");
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

    const movieItems = parsedCardContent.items;

    return (
        <View className="flex-1">
            <FlashList
                data={movieItems}
                numColumns={2}
                renderItem={({ item, index }) => (
                    <View className="relative">
                        <MovieCard
                            card={card}
                            movieItem={item}
                            onPress={() => !isEditMode && handleMoviePress(item)}
                            onLongPress={() => handleMovieLongPress(item)}
                        />
                        {isEditMode && (
                            <TouchableOpacity
                                className="absolute top-3 right-3 bg-red-600 rounded-full p-2 z-10"
                                onPress={() => handleDeleteMovie(item.externalId)}
                            >
                                <Image source={icons.star} className="size-5" style={{ tintColor: 'white' }} />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                keyExtractor={(item : any, index) => `${item.externalId}-${index}`}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View className="px-2 py-3">
                        <View className="flex-row items-center justify-center gap-3">
                            <Text className="text-2xl font-dmsans-bold text-stone-400 text-center">
                                {card.title}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setIsEditMode(!isEditMode)}
                                className="bg-stone-700 rounded-lg p-2"
                            >
                                <Image
                                    source={isEditMode ? icons.check : icons.edit_note}
                                    className="size-6"
                                    style={{ tintColor: colors.stone["300"] }}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-sm font-dmsans-regular text-stone-500 text-center mt-1">
                            {movieItems.length} film
                        </Text>
                    </View>
                }
                contentContainerStyle={{
                    paddingHorizontal: 4,
                    paddingBottom: 100,
                }}
            />

            {/* Add Button */}
            <TouchableOpacity
                onPress={() => setIsAddMode(true)}
                className="absolute bottom-6 right-6 bg-stone-600 rounded-full p-4 shadow-lg"
                style={{ elevation: 5 }}
            >
                <Image source={icons.add} className="size-8" style={{ tintColor: 'white' }} />
            </TouchableOpacity>

            {/* Movie Details Modal */}
            <Modal
                visible={selectedMovie !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedMovie(null)}
            >
                <TouchableOpacity
                    className="flex-1 bg-black/80 justify-center items-center p-6"
                    activeOpacity={1}
                    onPress={() => setSelectedMovie(null)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        className="bg-stone-800 rounded-2xl p-6 w-full max-w-md border-4 border-stone-700"
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View className="flex-row items-start gap-4 mb-4">
                            {selectedMovie?.metadata?.poster && (
                                <Image
                                    source={{ uri: selectedMovie.metadata.poster }}
                                    className="w-24 h-36 rounded-lg"
                                    resizeMode="cover"
                                />
                            )}
                            <View className="flex-1">
                                <Text className="text-white font-dmsans-bold text-xl mb-2">
                                    {selectedMovie?.metadata?.title}
                                </Text>
                                {selectedMovie?.metadata?.release_date && (
                                    <Text className="text-stone-400 font-dmsans-regular text-sm mb-2">
                                        {new Date(selectedMovie.metadata.release_date).getFullYear()}
                                    </Text>
                                )}
                                {selectedMovie?.metadata?.rating > 0 && (
                                    <View className="flex-row items-center gap-1">
                                        <Image source={icons.star} className="size-5" style={{ tintColor: colors.yellow["400"] }} />
                                        <Text className="text-white font-dmsans-medium text-base">
                                            {selectedMovie.metadata.rating.toFixed(1)}/10
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {selectedMovie?.metadata?.overview && (
                            <View className="mb-4">
                                <Text className="text-stone-300 font-dmsans-regular text-base leading-6">
                                    {selectedMovie.metadata.overview}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={() => setSelectedMovie(null)}
                            className="bg-stone-600 rounded-lg p-3 mt-2"
                        >
                            <Text className="text-white font-dmsans-bold text-center text-base">
                                Kapat
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Add Movie Modal */}
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
                            <Image source={icons.star} className="size-8" style={{ tintColor: colors.stone["400"] }} />
                        </TouchableOpacity>
                    </View>

                    <View className="p-4">
                        <View className="flex-row items-center bg-stone-800 rounded-lg px-4 py-3 border-2 border-stone-700">
                            <Image source={icons.search} className="size-6 mr-3" style={{ tintColor: colors.stone["400"] }} />
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
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="flex-row p-4 bg-stone-800 m-2 rounded-lg border-2 border-stone-700"
                                    onPress={() => handleAddMovie(item)}
                                    disabled={isSaving}
                                >
                                    {item.poster_path && (
                                        <Image
                                            source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster_path}` }}
                                            className="w-16 h-24 rounded-md mr-3"
                                            resizeMode="cover"
                                        />
                                    )}
                                    <View className="flex-1">
                                        <Text className="text-white font-dmsans-bold text-base mb-1">
                                            {item.title || item.original_title}
                                        </Text>
                                        {item.release_date && (
                                            <Text className="text-stone-400 font-dmsans-regular text-sm mb-2">
                                                {new Date(item.release_date).getFullYear()}
                                            </Text>
                                        )}
                                        {item.vote_average > 0 && (
                                            <View className="flex-row items-center gap-1">
                                                <Image source={icons.star} className="size-4" style={{ tintColor: colors.yellow["400"] }} />
                                                <Text className="text-stone-300 font-dmsans-medium text-sm">
                                                    {item.vote_average.toFixed(1)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            )}
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

            {/* Saving Overlay */}
            {isSaving && (
                <View className="absolute inset-0 bg-black/50 justify-center items-center">
                    <ActivityIndicator size="large" color="white" />
                </View>
            )}
        </View>
    );
};

export default CollectionDetail;