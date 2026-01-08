import { Alert, View } from "react-native";
import React, { useState } from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardCreateFields";
import { SCInput } from "@/components/Core/C_SCInput";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardType, CardVariant, ICard } from "@/interfaces/ICard";
import { createCard } from "@/services/appwrite";
import { SCDatePicker } from "@/components/Core/C_SCDatePicker";
import { CommitItemData } from "@/components/Form/C_SCCommitItem";
import { SCCommitList } from "@/components/Form/C_SCCommitList";

const ObjectiveCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  const [newCard, setNewCard] = useState<ICard>({
    $id: "",
    order: 10,
    title: "",
    content: "[]",
    type: CardType.OBJECTIVE,
    background: "#f00",
    variant: CardVariant.SMALL,
  });

  const [description, setDescription] = useState<string>("");
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
  const handleCreate = async () => {
    try {
      if (!newCard.title) {
        Alert.alert("Error", "Please enter a title");
        return;
      }

      const finalCard = {
        ...newCard,
        content: JSON.stringify({
          description: description,
          startDate: selectedStartDate,
          endDate: selectedEndDate,
          commits: commits,
        }),
      };

      await createCard(finalCard);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create task list:", error);
      Alert.alert("Error", "Failed to create task list. Please try again.");
    }
  };

  const [commits, setCommits] = useState<CommitItemData[]>([]);

  return (
    <SafeAreaView className="flex-1">
      <SCCoreCardCreateFields card={newCard} />

      <View className="mx-3 mt-6">
        <SCInput
          label="URL"
          placeholder="Enter a URL..."
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            newCard.content = text;
          }}
        />
        <View className="flex-row items-center justify-center gap-2 mt-8">
          <SCDatePicker value={selectedStartDate} onChange={setSelectedStartDate} label="Start Date" />
          <SCDatePicker value={selectedEndDate} onChange={setSelectedEndDate} label="End Date" />
        </View>
      </View>

      <View className="mb-24">
        <SCCommitList commits={commits} onCommitsChange={setCommits} />
      </View>

      <View className="mx-3 mt-6">
        <View className="flex-row items-center justify-center gap-4 mt-8">
          <SCButton text="Cancel" variant={ButtonVariant.LARGE} onPress={onClose} transparent />
          <SCButton text="Create" variant={ButtonVariant.LARGE} onPress={handleCreate} />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ObjectiveCreate;
