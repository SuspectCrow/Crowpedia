import { View, Alert } from "react-native";
import React, { useMemo } from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardCreateFields";
import { CardType, CardVariant, ICard } from "@/interfaces/ICard";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { createCard } from "@/services/appwrite";

const FolderCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  const newCard: ICard = useMemo(
    () => ({
      $id: "",
      order: 10,
      title: "",
      content: "",
      type: CardType.FOLDER,
      background: "#f00",
      variant: CardVariant.SMALL,
    }),
    [],
  );

  const handleCreate = async () => {
    try {
      if (!newCard.title) {
        Alert.alert("Error", "Please enter a title");
        return;
      }

      await createCard(newCard);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create folder:", error);
      Alert.alert("Error", "Failed to create folder. Please try again.");
    }
  };

  return (
    <View>
      <SCCoreCardCreateFields card={newCard} />
      <View className="flex-row items-center justify-center gap-4">
        <SCButton text="Cancel" variant={ButtonVariant.LARGE} onPress={onClose} />
        <SCButton text="Create" variant={ButtonVariant.LARGE} className={"bg-green-700"} onPress={handleCreate} />
      </View>
    </View>
  );
};
export default FolderCreate;
