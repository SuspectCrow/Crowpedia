import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { ICardDetailProps } from "@/app/(root)/card/detail/[id]";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";
import { router } from "expo-router";
import { updateCard } from "@/services/appwrite";
import { CardVariant } from "@/interfaces/ICard";

const FolderDetail = ({ card }: ICardDetailProps) => {
  const [tempCard, setTempCard] = React.useState(card);

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
    <View className="mx-2">
      <SCCoreCardCreateFields card={tempCard} selectedFolderId={card.parentFolder} cardVariant={card.variant} />

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
export default FolderDetail;
