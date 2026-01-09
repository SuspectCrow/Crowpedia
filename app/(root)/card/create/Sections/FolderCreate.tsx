import { View, Alert } from "react-native";
import React, { useMemo } from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";
import { CardType, CardVariant, ICard } from "@/interfaces/ICard";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { createCard } from "@/services/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView>
      <SCCoreCardCreateFields card={newCard} />
      <View className="flex-row items-center justify-center gap-4">
        <SCButton text="Cancel" variant={ButtonVariant.LARGE} onPress={onClose} transparent />
        <SCButton text="Create" variant={ButtonVariant.LARGE} className={"bg-green-700"} onPress={handleCreate} />
      </View>
    </SafeAreaView>
  );
};
export default FolderCreate;
