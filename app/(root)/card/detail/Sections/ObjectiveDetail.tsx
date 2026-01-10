import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { ICardDetailProps } from "@/app/(root)/card/detail/[id]";
import { updateCard } from "@/services/appwrite";
import { router } from "expo-router";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";
import { SCInput } from "@/components/Core/C_SCInput";
import { CommitItemData } from "@/components/Form/C_SCCommitItem";
import { SCDatePicker } from "@/components/Core/C_SCDatePicker";
import { SCCommitList } from "@/components/Form/C_SCCommitList";
import { formatDate, getDaysRemaining } from "@/helpers/dateUtils";

const ObjectiveDetail = ({ card, setAvailableActions, registerActionHandler }: ICardDetailProps) => {
  const [tempCard, setTempCard] = React.useState(card);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const parsedContent = React.useMemo(() => {
    try {
      return JSON.parse(card.content || "{}");
    } catch {
      return {};
    }
  }, [card.content]);

  const [description, setDescription] = useState<string>(parsedContent.description ? parsedContent.description : "");
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(
    parsedContent.startDate ? new Date(parsedContent.startDate) : new Date(),
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(
    parsedContent.endDate ? new Date(parsedContent.endDate) : new Date(),
  );
  const [commits, setCommits] = useState<CommitItemData[]>(
    Array.isArray(parsedContent.commits)
      ? parsedContent.commits.map((commit: any) => ({
          ...commit,
          date: commit.date ? new Date(commit.date) : new Date(),
        }))
      : [],
  );

  const handleUpdate = async () => {
    try {
      if (!tempCard.title) {
        Alert.alert("Error", "Please enter a title");
        return;
      }

      await updateCard(card.$id as string, {
        ...tempCard,
        content: JSON.stringify({
          description: description,
          startDate: selectedStartDate,
          endDate: selectedEndDate,
          commits: commits,
        }),
      });
    } catch (error) {
      console.error("Failed to update note:", error);
      Alert.alert("Error", "Failed to update note. Please try again.");
    }

    router.back();
  };

  const handleCommitsChange = async (newCommits: CommitItemData[]) => {
    setCommits(newCommits);
    try {
      await updateCard(card.$id as string, {
        ...tempCard,
        content: JSON.stringify({
          description: description,
          startDate: selectedStartDate,
          endDate: selectedEndDate,
          commits: newCommits,
        }),
      });
    } catch (error) {
      console.error("Failed to update commits:", error);
    }
  };

  React.useEffect(() => {
    if (setAvailableActions && registerActionHandler) {
      if (isEditMode) {
        setAvailableActions(["save"]);
        registerActionHandler("save", handleUpdate);
      } else {
        setAvailableActions(["edit"]);
        registerActionHandler("edit", () => setIsEditMode(true));
      }
    }
  }, [isEditMode, setAvailableActions, registerActionHandler, handleUpdate]);

  return (
    <View className="mx-3">
      {isEditMode ? (
        <View>
          <SCCoreCardCreateFields card={tempCard} selectedFolderId={card.parentFolder} cardVariant={card.variant} />

          <SCInput
            label="URL"
            placeholder="Enter a url..."
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              tempCard.content = text;
            }}
          />

          <View className="flex-row items-center justify-center gap-2 mt-8">
            <SCDatePicker value={selectedStartDate} onChange={setSelectedStartDate} label="Start Date" />
            <SCDatePicker value={selectedEndDate} onChange={setSelectedEndDate} label="End Date" />
          </View>
        </View>
      ) : (
        <View>
          <Text className="font-dmsans-bold text-neutral-300 text-2xl text-center">{card.title}</Text>

          <View className="flex-row items-center justify-center gap-2 mt-2">
            <Text className="font-dmsans-light text-green-400 text-sm">
              {parsedContent.startDate ? formatDate(new Date(parsedContent.startDate)) : ""}
            </Text>
            <Text className="font-dmsans-light text-neutral-400 text-sm">-</Text>
            <Text className="font-dmsans-light text-red-400 text-sm">
              {parsedContent.endDate ? formatDate(new Date(parsedContent.endDate)) : ""}
            </Text>
          </View>

          {parsedContent.description && (
            <Text className="font-dmsans-light text-neutral-400 text-sm mt-6">{parsedContent.description}</Text>
          )}

          <View className="flex-row items-center justify-center gap-2 mt-6">
            <Text className="font-dmsans-light text-neutral-300 text-lg">Days remaining until the start: </Text>
            <Text className="font-dmsans-bold text-neutral-300 text-lg">
              {parsedContent.startDate ? `${getDaysRemaining(new Date(parsedContent.startDate))} day` : "0 day"}
            </Text>
          </View>
          <View className="flex-row items-center justify-center gap-2">
            <Text className="font-dmsans-light text-neutral-300 text-lg">Days remaining until the end: </Text>
            <Text className="font-dmsans-bold text-neutral-300 text-lg">
              {parsedContent.endDate ? `${getDaysRemaining(new Date(parsedContent.endDate))} day` : "0 day"}
            </Text>
          </View>
        </View>
      )}

      <View className="mb-24">
        <SCCommitList commits={commits} onCommitsChange={handleCommitsChange} />
      </View>
    </View>
  );
};
export default ObjectiveDetail;
