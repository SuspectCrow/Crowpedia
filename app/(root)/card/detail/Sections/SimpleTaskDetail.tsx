import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { ICardDetailProps } from "@/app/(root)/card/detail/[id]";
import { updateCard } from "@/services/appwrite";
import { router } from "expo-router";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { SCInput } from "@/components/Core/C_SCInput";

const SimpleTaskDetail = ({ card }: ICardDetailProps) => {
  const [tempCard, setTempCard] = React.useState(card);

  const [description, setDescription] = useState<string>("");

  const handleUpdate = async () => {
    try {
      if (!tempCard.title) {
        Alert.alert("Error", "Please enter a title");
        return;
      }

      await updateCard(card.$id as string, tempCard);
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
        label="Description"
        placeholder="Enter a description..."
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          tempCard.content = text;
        }}
      />

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
export default SimpleTaskDetail;
