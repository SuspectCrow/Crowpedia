import { View, Text, ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { CardType, getCardIcon, ICard } from "@/interfaces/ICard";
import { getCardById } from "@/services/appwrite";
import colors from "tailwindcss/colors";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";
import { SCInput } from "@/components/Core/C_SCInput";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { SCNavbar } from "@/components/Partials/C_SCNavbar";
import { useFolderNavigation } from "@/hooks/useFolderNavigation";
import NoteDetail from "@/app/(root)/card/detail/Sections/NoteDetail";
import CollectionDetail from "@/app/(root)/card/detail/Sections/CollectionDetail";
import ObjectiveDetail from "@/app/(root)/card/detail/Sections/ObjectiveDetail";
import EventDetail from "@/app/(root)/card/detail/Sections/EventDetail";
import FolderDetail from "@/app/(root)/card/detail/Sections/FolderDetail";
import LinkDetail from "@/app/(root)/card/detail/Sections/LinkDetail";
import PasswordDetail from "@/app/(root)/card/detail/Sections/PasswordDetail";
import SimpleTaskDetail from "@/app/(root)/card/detail/Sections/SimpleTaskDetail";
import TaskListDetail from "@/app/(root)/card/detail/Sections/TaskListDetail";

export interface ICardDetailProps {
  card: ICard;
  refresh?: () => void;
}

const CardContentRenderer = ({ card }: { card: ICard }) => {
  switch (card.type) {
    case CardType.COLLECTION:
      return <CollectionDetail card={card} />;
    case CardType.EVENT:
      return <EventDetail card={card} />;
    case CardType.FOLDER:
      return <FolderDetail card={card} />;
    case CardType.LINK:
      return <LinkDetail card={card} />;
    case CardType.NOTE:
      return <NoteDetail card={card} />;
    case CardType.OBJECTIVE:
      return <ObjectiveDetail card={card} />;
    case CardType.PASSWORD:
      return <PasswordDetail card={card} />;
    case CardType.SIMPLE_TASK:
      return <SimpleTaskDetail card={card} />;
    case CardType.TASK_LIST:
      return <TaskListDetail card={card} />;

    default:
      return (
        <View className="absolute top-0 w-full px-1 flex-col justify-center h-full items-center">
          <Text className="text-neutral-600 font-dmsans-medium text-center text-md px-24">
            Not found this type of card detail view.
          </Text>
        </View>
      );
  }
};

const CardDetail = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [card, setCard] = useState<ICard | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const res = await getCardById(id as string);
    setCard(res as unknown as ICard | null);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const { handleBack } = useFolderNavigation(undefined, "/folders");

  return (
    <SafeAreaView className="flex-1">
      <SCNavbar
        variant={"simple"}
        title={card?.title}
        icon={getCardIcon(card?.type)}
        showBackButton={true}
        onBackPress={handleBack}
        className="absolute z-[100]"
      />

      {loading && !card && (
        <View className="absolute top-0 w-full px-1 flex-row justify-center items-center gap-3 h-full z-30 bg-neutral-950">
          <ActivityIndicator size="small" color={colors.neutral["600"]} />
          <Text className="text-neutral-600 font-dmsans-medium text-center text-xl">Loading</Text>
        </View>
      )}

      <ScrollView
        className="relative mt-28"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.neutral["600"]} />}
      >
        {card && <CardContentRenderer card={card} />}
      </ScrollView>
    </SafeAreaView>
  );
};
export default CardDetail;
