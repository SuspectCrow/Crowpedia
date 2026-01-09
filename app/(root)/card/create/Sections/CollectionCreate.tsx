import React, { useState } from "react";
import { Alert, View, Text } from "react-native";
import { createCard } from "@/services/appwrite";
import { ICard, CardType, CardVariant } from "@/interfaces/ICard";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCButton, ButtonVariant } from "@/components/Core/C_SCButton";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";
import { SCSelector, SelectorOption } from "@/components/Core/C_SCSelector";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";

const PRESETS: SelectorOption[] = [{ key: "media", title: "Media (Movie/TV)", icon: "movie" }];

const CollectionCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  const [selectedPreset, setSelectedPreset] = useState("media");
  const [newCard, setNewCard] = useState<ICard>({
    $id: "",
    order: 10,
    title: "",
    content: "",
    type: CardType.COLLECTION,
    background: "#8b5cf6",
    variant: CardVariant.SMALL,
  });

  const handleCreate = async () => {
    if (!newCard.title.trim()) {
      Alert.alert("Missing Information", "Please enter a title.");
      return;
    }

    try {
      const contentObj = {
        preset: selectedPreset,
        items: [],
      };

      const finalCard = {
        ...newCard,
        content: JSON.stringify(contentObj),
      };

      await createCard(finalCard);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Create Collection Error:", error);
      Alert.alert("Error", "There was a problem creating the collection.");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <SCCoreCardCreateFields card={newCard} />

      <View className="mx-3 mt-6">
        <View className="mb-6">
          <Text className="text-neutral-400 font-dmsans-semibold text-lg mb-3">Collection Type</Text>
          <SCSelector options={PRESETS} selectedKey={selectedPreset} onSelect={setSelectedPreset} />

          <View className="mt-3 p-3 rounded-xl border border-neutral-800 bg-neutral-900/50 opacity-50">
            <Text className="text-neutral-600 font-dmsans-medium text-sm text-center">More coming soon...</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-center gap-4 mt-8">
          <SCButton text="Cancel" variant={ButtonVariant.LARGE} onPress={onClose} transparent />
          <SCButton text="Create" variant={ButtonVariant.LARGE} className="bg-green-700" onPress={handleCreate} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CollectionCreate;
