import { useCallback, useMemo } from "react";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { ICard, CardType } from "@/interfaces/ICard";

export const useFolderNavigation = (dataCards: ICard[] | undefined, pathname: string = "/") => {
  const router = useRouter();
  const params = useLocalSearchParams<{ folderId?: string }>();
  const navigation = useNavigation();

  const folderPaths = useMemo(() => {
    if (!params.folderId || !dataCards) return [];

    const paths: string[] = [];
    let currentId: string | undefined = params.folderId;

    while (currentId) {
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
    (card: ICard) => {
      if (card.type === CardType.FOLDER) {
        router.push({ pathname: pathname as any, params: { folderId: card.$id } });
      } else {
        console.log(card.title);
      }
    },
    [router, pathname],
  );

  const handleBack = useCallback(() => {
    if (params.folderId) {
      const currentFolder = dataCards?.find((c) => c.$id === params.folderId);

      if (currentFolder?.parentFolder) {
        router.push({ pathname: pathname as any, params: { folderId: currentFolder.parentFolder } });
      } else {
        router.push({ pathname: pathname as any, params: { folderId: undefined } });
      }
    } else if (navigation.canGoBack()) {
      router.back();
    }
  }, [params.folderId, dataCards, navigation, router, pathname]);

  const activeFolderName =
    params.folderId && dataCards ? dataCards.find((c) => c.$id === params.folderId)?.title || "Folder" : "Home";

  return {
    folderPaths,
    handleCardPress,
    handleBack,
    activeFolderName,
  };
};
