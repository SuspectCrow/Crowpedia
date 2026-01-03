import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCNavbar } from "@/components/Partials/C_SCNavbar";
import SCQuickActionsMenu from "@/components/Partials/C_SCQuickActionsMenu";
import { router, useLocalSearchParams } from "expo-router";
import { getCardIcon } from "@/interfaces/ICard";
import NoteCreate from "@/app/(root)/card/create/Sections/NoteCreate";
import TaskListCreate from "@/app/(root)/card/create/Sections/TaskListCreate";
import EventCreate from "@/app/(root)/card/create/Sections/EventCreate";
import LinkCreate from "@/app/(root)/card/create/Sections/LinkCreate";
import ObjectiveCreate from "@/app/(root)/card/create/Sections/ObjectiveCreate";
import SimpleTaskCreate from "@/app/(root)/card/create/Sections/SimpleTaskCreate";
import CollectionCreate from "@/app/(root)/card/create/Sections/CollectionCreate";
import FolderCreate from "@/app/(root)/card/create/Sections/FolderCreate";
import PasswordCreate from "@/app/(root)/card/create/Sections/PasswordCreate";

export interface CreateCardProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateCard = () => {
  const { type } = useLocalSearchParams<{ type?: string }>();

  const CardCreationContent = () => {
    switch (type) {
      case "Note":
        return <NoteCreate onClose={() => router.back()} onSuccess={() => router.back()} />;
      case "TaskList":
        return <TaskListCreate onClose={() => router.back()} onSuccess={() => router.back()} />;
      case "Event":
        return <EventCreate onClose={() => router.back()} onSuccess={() => router.back()} />;
      case "Link":
        return <LinkCreate onClose={() => router.back()} onSuccess={() => router.back()} />;
      case "Objective":
        return <ObjectiveCreate onClose={() => router.back()} onSuccess={() => router.back()} />;
      case "SimpleTask":
        return <SimpleTaskCreate onClose={() => router.back()} onSuccess={() => router.back()} />;
      case "Collection":
        return <CollectionCreate onClose={() => router.back()} onSuccess={() => router.back()} />;
      case "Folder":
        return <FolderCreate onClose={() => router.back()} onSuccess={() => router.back()} />;
      case "Password":
        return <PasswordCreate onClose={() => router.back()} onSuccess={() => router.back()} />;
      default:
        return <Text className="text-white text-center mt-10">Bilinmeyen Tür</Text>;
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#0a0a0a" }}>
      <View className="flex-1 relative">
        <SCNavbar
          variant={"simple"}
          showBackButton={true}
          onBackPress={() => router.back()}
          rightAction={{
            icon: "settings",
            onPress: () => console.log("Settings"),
          }}
          icon={getCardIcon(type)}
          title={`Create ${type}`}
          className="absolute z-[100]"
        />

        <ScrollView className="flex-1 relative" contentContainerStyle={{ paddingTop: 112 }}>
          <View className="flex-1 mt-4">
            <CardCreationContent />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
export default CreateCard;
