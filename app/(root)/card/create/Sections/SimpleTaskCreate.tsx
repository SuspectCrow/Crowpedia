import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";
import { SCInput } from "@/components/Core/C_SCInput";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { CardType, CardVariant, ICard } from "@/interfaces/ICard";
import { createCard } from "@/services/appwrite";

const SimpleTaskCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  const [newCard, setNewCard] = useState<ICard>({
    $id: "",
    order: 10,
    title: "",
    content: "[]",
    type: CardType.SIMPLE_TASK,
    background: "#f00",
    variant: CardVariant.SMALL,
  });

  const [description, setDescription] = useState<string>("");

  const handleCreate = async () => {
    try {
      if (!newCard.title) {
        Alert.alert("Error", "Please enter a title");
        return;
      }

      const finalCard = {
        ...newCard,
        content: JSON.stringify(description),
      };

      await createCard(finalCard);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create task list:", error);
      Alert.alert("Error", "Failed to create task list. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <SCCoreCardCreateFields card={newCard} />

      <View className="mx-3 mt-6">
        <SCInput
          label="Description"
          placeholder="Enter a description..."
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            newCard.content = text;
          }}
        />
        <View className="flex-row items-center justify-center gap-4 mt-8">
          <SCButton text="Cancel" variant={ButtonVariant.LARGE} onPress={onClose} transparent />
          <SCButton text="Create" variant={ButtonVariant.LARGE} onPress={handleCreate} />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default SimpleTaskCreate;
