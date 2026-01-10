import { useCallback, useMemo } from "react";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { ICard, CardType } from "@/interfaces/ICard";
import { updateCard } from "@/services/appwrite";

export const useFolderNavigation = (dataCards: ICard[] | undefined, pathname: string = "/", onRefresh?: () => void) => {
  const router = useRouter();
  const params = useLocalSearchParams<{ folderId?: string }>();
  const navigation = useNavigation();

  const folderPaths = useMemo(() => {
    if (!params.folderId || params.folderId === "home" || !dataCards) return [];

    const paths: string[] = [];
    let currentId: string | undefined = params.folderId;

    while (currentId && currentId !== "home") {
      const folder = dataCards.find((c) => c.$id === currentId);
      if (folder) {
        paths.unshift(folder.title);
        currentId = folder.parentFolder;
      } else {
        break;
      }
    }
    return paths;
  }, [params.folderId, dataCards]);

  const handleCardPress = useCallback(
    async (card: ICard) => {
      let parsedContent;
      try {
        parsedContent = JSON.parse(card.content || "{}");
      } catch {
        parsedContent = {};
      }

      switch (card.type) {
        case CardType.FOLDER:
          router.push({ pathname: pathname as any, params: { folderId: card.$id } });
          break;
        case CardType.SIMPLE_TASK:
          // Toggle value - works for both true and false
          parsedContent.value = !parsedContent.value;

          try {
            await updateCard(card.$id as string, {
              ...card,
              content: JSON.stringify({
                description: parsedContent.description || "",
                value: parsedContent.value,
              }),
            });

            // Refresh the page after successful update
            if (onRefresh) {
              onRefresh();
            }
          } catch (error) {
            console.error("Error updating task card:", error);
          }
          break;
        default:
          router.push(`/card/detail/${card.$id}`);
          break;
      }
    },
    [router, pathname, onRefresh],
  );

  const handleCardLongPress = useCallback(
    (card: ICard) => {
      switch (card.type) {
        default:
          router.push(`/card/detail/${card.$id}`);
      }
    },
    [router, pathname],
  );

  const handleBack = useCallback(() => {
    if (params.folderId && params.folderId !== "home") {
      const currentFolder = dataCards?.find((c) => c.$id === params.folderId);

      if (currentFolder?.parentFolder && currentFolder.parentFolder !== "home") {
        router.push({ pathname: pathname as any, params: { folderId: currentFolder.parentFolder } });
      } else {
        router.push({ pathname: pathname as any, params: { folderId: undefined } });
      }
    } else if (navigation.canGoBack()) {
      router.back();
    }
  }, [params.folderId, dataCards, navigation, router, pathname]);

  const activeFolderName =
    params.folderId && params.folderId !== "home" && dataCards
      ? dataCards.find((c) => c.$id === params.folderId)?.title || "Folder"
      : "Home";

  return {
    folderPaths,
    handleCardPress,
    handleCardLongPress,
    handleBack,
    activeFolderName,
  };
};
