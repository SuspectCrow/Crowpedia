import { View, Alert, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";
import { SCTextEditor } from "@/components/Form/C_SCTextEditor";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";
import { CardType, CardVariant, ICard } from "@/interfaces/ICard";
import { SCButton, ButtonVariant } from "@/components/Core/C_SCButton";
import { createCard } from "@/services/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

const NoteCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  const [newCard, setNewCard] = useState<ICard>({
    $id: "",
    order: 10,
    title: "",
    content: "",
    type: CardType.NOTE,
    background: "#f00",
    variant: CardVariant.SMALL,
  });

  const [isEditorOpen, setIsEditorOpen] = useState(true);

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
      console.error("Failed to create note:", error);
      Alert.alert("Error", "Failed to create note. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <SCCoreCardCreateFields card={newCard} />

      <View className="mx-3 mt-2">
        <SCButton
          text="Open Text Editor"
          icon="edit"
          variant={ButtonVariant.MEDIUM}
          onPress={() => setIsEditorOpen(true)}
          className="w-full bg-neutral-800 border-neutral-700"
        />

        {/*<View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-800">*/}
        {/*  <Text className="text-white font-dmsans-medium text-lg">{label || "Editor"}</Text>*/}
        {/*  <TouchableOpacity onPress={onDonePressed} className="bg-neutral-800 px-4 py-1.5 rounded-lg">*/}
        {/*    <Text className="text-white font-dmsans-medium">Done</Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*</View>*/}

        <SCTextEditor
          label="Note Content"
          placeholder="Write your thoughts here..."
          initialValue={newCard.content}
          onChange={(html) => {
            setNewCard((prev) => ({ ...prev, content: html }));
          }}
          visible={isEditorOpen}
          onDonePressed={() => setIsEditorOpen(false)}
        />
      </View>

      <View className="flex-row items-center justify-center gap-4">
        <SCButton text="Cancel" variant={ButtonVariant.LARGE} onPress={onClose} transparent />
        <SCButton text="Create" variant={ButtonVariant.LARGE} className={"bg-green-700"} onPress={handleCreate} />
      </View>
    </SafeAreaView>
  );
};
export default NoteCreate;
