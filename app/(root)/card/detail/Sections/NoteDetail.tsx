import { View, Text, ActivityIndicator, Alert } from "react-native";
import React, { useState } from "react";
import { ICardDetailProps } from "@/app/(root)/card/detail/[id]";
import { SCTextEditor } from "@/components/Form/C_SCTextEditor";
import { SCNavbar } from "@/components/Partials/C_SCNavbar";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import colors from "tailwindcss/colors";
import { getCardIcon } from "@/interfaces/ICard";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";
import { router } from "expo-router";
import { updateCard } from "@/services/appwrite";

const NoteDetail = ({ card }: ICardDetailProps) => {
  const [tempCard, setTempCard] = React.useState(card);

  const [isEditorOpen, setIsEditorOpen] = useState(true);

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
    <View>
      <SCTextEditor
        label="Note Content"
        placeholder="Write your thoughts here..."
        initialValue={card.content}
        onChange={(html) => {
          setTempCard((prev) => ({ ...prev, content: html }));
        }}
        visible={isEditorOpen}
        onDonePressed={() => setIsEditorOpen(false)}
        ListHeaderComponent={
          <SCNavbar
            variant={"simple"}
            title={card?.title}
            icon={getCardIcon(card?.type)}
            showBackButton={true}
            onBackPress={() => router.back()}
            rightAction={{
              icon: "edit",
              onPress: () => setIsEditorOpen(false),
            }}
            className="max-h-20"
          />
        }
      />

      <View className="mx-2">
        <SCButton
          text="Open Text Editor"
          icon="edit"
          variant={ButtonVariant.MEDIUM}
          onPress={() => setIsEditorOpen(true)}
          className="w-full bg-neutral-800 border-neutral-700 mt-6"
        />
        <SCCoreCardCreateFields card={tempCard} selectedFolderId={card.parentFolder} />

        <View className="flex-row items-center justify-center gap-4">
          <SCButton
            text="Cancel"
            variant={ButtonVariant.LARGE}
            onPress={() => {
              router.back();
            }}
            transparent
          />
          <SCButton text="Create" variant={ButtonVariant.LARGE} className={"bg-green-700"} onPress={handleUpdate} />
        </View>
      </View>
    </View>
  );
};
export default NoteDetail;
