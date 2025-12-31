import { Alert, Linking, ScrollView, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState, useEffect } from "react";

import { router, useLocalSearchParams } from "expo-router";

import { useAppwrite } from "@/lib/useAppwrite";
import { getCards, getCardById, updateCard } from "@/lib/appwrite";
import { ICard } from "@/interfaces/ICard";
import colors from "tailwindcss/colors";
import { SCNavbar } from "@/components/Partials/C_SCNavbar";

const TYPE_ORDER = [
  "Event",
  "Objective",
  "TaskList",
  "SimpleTask",
  "Note",
  "Link",
  "Collection",
  "Password",
  "Routine",
];

export default function Index() {
  const [quickButtonMenuVisibility, setQuickMenuButton] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<
    { id: string | null; name: string }[]
  >([{ id: null, name: "Home" }]);

  const handlePress = async (id: string) => {
    const Card = (await getCardById(id)) as unknown as ICard;

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
        setFolderPath((prev) => [
          ...prev,
          { id: Card.$id, name: Card.title || "Untitled" },
        ]);
        break;

      case "SimpleTask":
        try {
          await updateCard(Card.$id, {
            content: String(!(Card.content === "true")),
          });
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
  };

  const handleLongPress = async (id: string) => {
    const Card = (await getCardById(id)) as unknown as ICard;

    if (!Card) return undefined;

    router.push(`/card/detail/${id}`);
  };

  const handleNavBarPressBack = async () => {
    if (folderPath.length > 1) {
      const newPath = [...folderPath];
      newPath.pop();
      const previousFolder = newPath[newPath.length - 1];

      setFolderPath(newPath);
      setActiveFolder(previousFolder.id);
    }
  };

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const {
    data: dataCards,
    refetch: refetchCards,
    loading: loadingCards,
  } = useAppwrite({
    fn: getCards,
    params: { filter: params.filter!, query: params.query!, limit: 6 },
    skip: true,
  });

  useEffect(() => {
    refetchCards({ filter: params.filter!, query: params.query!, limit: 32 });
  }, [params.filter, params.query]);

  const cardList = Array.isArray(dataCards)
    ? (dataCards as unknown as ICard[]).filter((card) => {
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

  return (
    <View
      className="flex-1 h-full"
      style={{ backgroundColor: colors.neutral["950"] }}
    >
      <Image
        source={{
          uri: "https://i.pinimg.com/736x/2e/32/dc/2e32dcc152177503e7fb6cafac26fe22.jpg",
        }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />

      <SafeAreaView
        className="h-full relative"
        edges={["bottom", "left", "right"]}
      >
        <SCNavbar
          variant="breadcrumb"
          showBackButton={true}
          onBackPress={() => console.log("Geri")}
          breadcrumbs={folderPath.map((f) => f.name)}
          rightAction={{
            icon: "settings",
            onPress: () => console.log("Settings"),
          }}
        />

        <ScrollView className="pb-20"></ScrollView>
      </SafeAreaView>
    </View>
  );
}
