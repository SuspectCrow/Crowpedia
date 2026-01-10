import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { ICardDetailProps } from "@/app/(root)/card/detail/[id]";
import { updateCard } from "@/services/appwrite";
import { router } from "expo-router";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { SCInput } from "@/components/Core/C_SCInput";

const SimpleTaskDetail = ({ card, setAvailableActions, registerActionHandler }: ICardDetailProps) => {
  const [tempCard, setTempCard] = React.useState(card);

  const parsedContent = React.useMemo(() => {
    try {
      return JSON.parse(card.content || "{}");
    } catch {
      return {};
    }
  }, [card.content]);

  const [description, setDescription] = useState<string>(parsedContent.description || "");

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
          value: parsedContent.value || false,
        }),
      });
    } catch (error) {
      console.error("Failed to update note:", error);
      Alert.alert("Error", "Failed to update note. Please try again.");
    }

    router.back();
  };

  React.useEffect(() => {
    if (setAvailableActions && registerActionHandler) {
      setAvailableActions(["save"]);
      registerActionHandler("save", handleUpdate);
    }
  }, [setAvailableActions, registerActionHandler, handleUpdate]);

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
    </View>
  );
};
export default SimpleTaskDetail;
