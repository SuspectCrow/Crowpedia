import {Alert, Linking, ScrollView, Text, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useCallback, useState} from "react";
import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { useAppwrite } from "@/lib/useAppwrite";
import {getCards, getCardById, updateCard} from "@/lib/appwrite";
import C_NavBar from "@/components/C_NavBar";
import {ICard} from "@/interfaces/ICard";
import {ButtonVariant, SCButton} from "@/components/Core/C_SCButton";
import {SCInput} from "@/components/Core/C_SCInput";
import {SCCheckBox} from "@/components/Core/C_SCCheckBox";
import {SCSwitch} from "@/components/Core/C_SCSwitch";
import {SCTimePicker} from "@/components/Core/C_SCTimePicker";
import {SCDatePicker} from "@/components/Core/C_SCDatePicker";
import {SCSelector, SelectorOption} from "@/components/Core/C_SCSelector";

const TYPE_ORDER = ['Event', 'Objective', 'TaskList', 'SimpleTask', 'Note', 'Link', 'Collection', 'Password', 'Routine'];

export default function Index() {
    const [quickButtonMenuVisibility, setQuickMenuButton] = useState(false);
    const [activeFolder, setActiveFolder] = useState<string | null>(null);
    const [folderPath, setFolderPath] = useState<Array<{id: string | null, name: string}>>([
        { id: null, name: "HOME" }
    ]);

    const handlePress = async (id: string) => {
        const Card = await getCardById(id) as unknown as ICard;

        if (!Card) return undefined;

        switch (Card.type) {
            case "Link":
                try {
                    await Linking.openURL(Card.content);
                } catch (error) {
                    Alert.alert(`URL açılamadı: ${Card.content}`);
                }
                break;
            case "Note":
                router.push(`/card/detail/${id}`);
                break;

            case "Folder":
                setActiveFolder(Card.$id as string);
                setFolderPath(prev => [...prev, { id: Card.$id, name: Card.title || "Untitled" }]);
                break;

            case "SimpleTask":
                try {
                    await updateCard(Card.$id, { content: String(!(Card.content === "true")) });
                    Card.content = String(!(Card.content === "true"));
                    onRefresh();
                } catch (error) {
                    console.error("Kaydetme hatası:", error);
                }
                break;

            default:
                router.push(`/card/detail/${id}`);
                break;
        }
    }

    const handleLongPress = async (id: string) => {
        const Card = await getCardById(id) as unknown as ICard;

        if (!Card) return undefined;

        router.push(`/card/detail/${id}`);
    }

    const handleNavBarPressBack = async () => {
        if (folderPath.length > 1) {
            const newPath = [...folderPath];
            newPath.pop();
            const previousFolder = newPath[newPath.length - 1];

            setFolderPath(newPath);
            setActiveFolder(previousFolder.id);
        }
    }

    const params = useLocalSearchParams<{ query?: string; filter?: string }>();

    const { data: dataCards, refetch: refetchCards, loading: loadingCards} =
        useAppwrite({
            fn: getCards,
            params: {filter: params.filter!, query: params.query!, limit: 6,},
            skip: true,
        });

    useEffect(() => {
        refetchCards({filter: params.filter!, query: params.query!, limit: 32,});
    }, [params.filter, params.query]);

    const cardList = Array.isArray(dataCards)
        ? (dataCards as unknown as ICard[]).filter(card => {
            return card.parentFolder == activeFolder;
        })
        : [];

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await refetchCards({
                filter: params.filter!,
                query: params.query!,
                limit: 32,
            });
        } catch (error) {
            console.error("Yenileme sırasında hata oluştu:", error);
        } finally {
            setRefreshing(false);
        }
    }, [refetchCards, params]);


    const [darkMode, setDarkMode] = useState(false);
    const [wifi, setWifi] = useState(true);

    const [isAgreed, setIsAgreed] = useState(false);
    const [isNotificationOn, setIsNotificationOn] = useState(true);

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());

    const [size, setSize] = useState("small");
    const sizeOptions: SelectorOption[] = [
        { key: "small", title: "Small" },
        { key: "large", title: "Large" },
        { key: "portrait", title: "Portrait" }
    ];

    const [mediaType, setMediaType] = useState("movie");
    const mediaOptions: SelectorOption[] = [
        { key: "movie", title: "Movie", icon: "movie" },
        { key: "tv", title: "TV", icon: "tv" }
    ];

    const [filter, setFilter] = useState("all");
    const manyOptions: SelectorOption[] = [
        { key: "all", title: "All" },
        { key: "recent", title: "Recent" },
        { key: "popular", title: "Popular" },
        { key: "fav", title: "Fav" },
        { key: "old", title: "Oldest" },
    ];

    return (
        <SafeAreaView className="p-1 h-full relative" style={{ backgroundColor: '#292524' }} >
            <C_NavBar activePaths={folderPath.map(f => f.name)} OnPressBack={folderPath.length > 1 ? handleNavBarPressBack : undefined}/>
            <ScrollView className="pb-20">
                {/*<SCButton text="Default Button" />*/}

                {/*<SCButton*/}
                {/*    variant={ButtonVariant.SMALL}*/}
                {/*    text="Back"*/}
                {/*    icon="chevron-left"*/}
                {/*/>*/}

                {/*<SCButton*/}
                {/*    variant={ButtonVariant.ICON_ONLY}*/}
                {/*    icon="add"*/}
                {/*/>*/}

                {/*<SCButton*/}
                {/*    text="Custom Color"*/}
                {/*    className="bg-red-600 border-red-400"*/}
                {/*/>*/}

                {/*<SCInput*/}
                {/*    label="Input Title"*/}
                {/*    placeholder="Search on Cards.."*/}
                {/*    leftIcon="search"*/}
                {/*/>*/}

                {/*<SCInput*/}
                {/*    label="Password"*/}
                {/*    placeholder="Enter password"*/}
                {/*    secureTextEntry={!showPassword}*/}
                {/*    rightIcon={showPassword ? "visibility" : "visibility-off"}*/}
                {/*    onRightIconPress={() => setShowPassword(!showPassword)}*/}
                {/*/>*/}

                {/*<SCInput*/}
                {/*    placeholder="Search with filter..."*/}
                {/*    leftIcon="search"*/}
                {/*    rightIcon="filter-list"*/}
                {/*    onRightIconPress={() => console.log("Filtre açılıyor...")}*/}
                {/*/>*/}
                {/*<SCCheckBox*/}
                {/*    label="Kullanım koşullarını kabul ediyorum"*/}
                {/*    checked={isAgreed}*/}
                {/*    onChange={setIsAgreed}*/}
                {/*/>*/}

                {/*<SCCheckBox*/}
                {/*    label="Bildirimleri aç"*/}
                {/*    icon="notifications"*/}
                {/*    checked={isNotificationOn}*/}
                {/*    onChange={setIsNotificationOn}*/}
                {/*/>*/}


                {/*<SCSwitch*/}
                {/*    label="Karanlık Mod"*/}
                {/*    icon="dark-mode"*/}
                {/*    value={darkMode}*/}
                {/*    onValueChange={setDarkMode}*/}
                {/*/>*/}

                {/*<SCSwitch*/}
                {/*    label="Wi-Fi"*/}
                {/*    icon="wifi"*/}
                {/*    labelPosition="right"*/}
                {/*    value={wifi}*/}
                {/*    onValueChange={setWifi}*/}
                {/*    className="self-start"*/}
                {/*/>*/}

                {/*<View className="flex flex-row gap-1.5 p-5 justify-center">*/}

                {/*    <SCDatePicker*/}
                {/*        label="Date"*/}
                {/*        value={date}*/}
                {/*        onChange={setDate}*/}
                {/*    />*/}

                {/*    <SCTimePicker*/}
                {/*        label="Time"*/}
                {/*        value={time}*/}
                {/*        onChange={setTime}*/}
                {/*    />*/}
                {/*</View>*/}

                <View className="flex-1 p-5 gap-8 justify-center">

                    {/* 3 Seçenekli Yapı */}
                    <View>
                        <Text className="text-gray-400 mb-2">Background Size</Text>
                        <SCSelector
                            options={sizeOptions}
                            selectedKey={size}
                            onSelect={setSize}
                        />
                    </View>

                    {/* 2 Seçenekli İkonlu Yapı */}
                    <View>
                        <Text className="text-gray-400 mb-2">Media Type</Text>
                        <SCSelector
                            options={mediaOptions}
                            selectedKey={mediaType}
                            onSelect={setMediaType}
                        />
                    </View>

                    {/* 5 Seçenekli (Wrap) Yapı */}
                    <View>
                        <Text className="text-gray-400 mb-2">Filters (Multi-line)</Text>
                        <SCSelector
                            options={manyOptions}
                            selectedKey={filter}
                            onSelect={setFilter}
                        />
                    </View>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}