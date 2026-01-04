import { useState, useMemo, useEffect } from "react";
import { useAppwrite } from "@/lib/useAppwrite";
import { getCards } from "@/services/appwrite";
import { CardType, ICard, getCardIcon } from "@/interfaces/ICard";
import { TagOption } from "@/components/Core/C_SCTagSelector";

const cardTypeOrder: Record<string, number> = {
  [CardType.FOLDER]: 1,
  [CardType.NOTE]: 2,
  [CardType.TASK_LIST]: 3,
  [CardType.SIMPLE_TASK]: 4,
  [CardType.OBJECTIVE]: 5,
  [CardType.ROUTINE]: 6,
  [CardType.EVENT]: 7,
  [CardType.COLLECTION]: 8,
  [CardType.LINK]: 9,
  [CardType.PASSWORD]: 10,
};

export const useCardsData = (query: string | undefined, folderId: string | undefined) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const {
    data: dataCards,
    refetch: refetchCards,
    loading: loadingCards,
  } = useAppwrite({
    fn: getCards,
    params: {
      limit: 99,
    },
    skip: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      refetchCards({
        limit: 99,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const filteredCards = useMemo(() => {
    if (!dataCards) return [];

    let filtered = [...dataCards];

    const activeFolder = folderId || "home";
    filtered = filtered.filter((card) => card.parentFolder === activeFolder);

    if (selectedFilters.length > 0) {
      const isFavoriteSelected = selectedFilters.includes("favorites");
      const otherFilters = selectedFilters.filter((f) => f !== "favorites");

      filtered = filtered.filter((card) => {
        const matchesFavorite = isFavoriteSelected ? card.isFavorite : false;
        const matchesType = otherFilters.length > 0 ? otherFilters.includes(card.type || "") : false;

        return matchesFavorite || matchesType;
      });
    }

    return filtered.sort((a, b) => {
      const orderA = cardTypeOrder[a.type as string] || 999;
      const orderB = cardTypeOrder[b.type as string] || 999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return (a.title || "").toString().localeCompare((b.title || "").toString());
    });
  }, [dataCards, selectedFilters, folderId]);

  const filterOptions: TagOption[] = useMemo(() => {
    return Object.values(CardType).map((type) => ({
      key: type,
      title: type,
      icon: getCardIcon(type),
    }));
  }, []);

  return {
    dataCards,
    filteredCards,
    loadingCards,
    refetch: refetchCards,
    selectedFilters,
    setSelectedFilters,
    filterOptions,
  };
};
