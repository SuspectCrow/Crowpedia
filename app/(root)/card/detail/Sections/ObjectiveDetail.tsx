import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { ICardDetailProps } from "@/app/(root)/card/detail/[id]";
import { updateCard } from "@/services/appwrite";
import { router } from "expo-router";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";
import { SCInput } from "@/components/Core/C_SCInput";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { CommitItemData } from "@/components/Form/C_SCCommitItem";
import { SCDatePicker } from "@/components/Core/C_SCDatePicker";
import { SCCommitList } from "@/components/Form/C_SCCommitList";

const ObjectiveDetail = ({ card }: ICardDetailProps) => {
  const [tempCard, setTempCard] = React.useState(card);

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

  return (
    <View className="mx-3">
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

      <View className="mb-24">
        <SCCommitList commits={commits} onCommitsChange={setCommits} />
      </View>

      <View className="flex-row items-center justify-center gap-4">
        <SCButton
          text="Cancel"
          variant={ButtonVariant.LARGE}
          onPress={() => {
            router.back();
          }}
          transparent
        />
        <SCButton text="Update" variant={ButtonVariant.LARGE} className={"bg-green-700"} onPress={handleUpdate} />
      </View>
    </View>
  );
};
export default ObjectiveDetail;
