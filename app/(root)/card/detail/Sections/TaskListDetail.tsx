import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { ICardDetailProps } from "@/app/(root)/card/detail/[id]";
import { SCTaskListEditor } from "@/components/Form/C_SCTaskListEditor";
import { ITaskItem } from "@/interfaces/ICard";
import { createCard, updateCard } from "@/services/appwrite";
import { router } from "expo-router";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";

const TaskListDetail = ({ card }: ICardDetailProps) => {
  const [tempCard, setTempCard] = React.useState(card);
  const rawTaskList = tempCard.content ? JSON.parse(tempCard.content) : [];

  const [taskList, setTaskList] = useState<ITaskItem[]>(rawTaskList);

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
      <SCTaskListEditor taskList={taskList} onTaskListChange={setTaskList} />
      <SCCoreCardCreateFields card={tempCard} />
      <View className="flex-row items-center justify-center gap-4 mt-8">
        <SCButton
          text="Cancel"
          variant={ButtonVariant.LARGE}
          onPress={() => {
            router.back();
          }}
          transparent
        />
        <SCButton text="Create" variant={ButtonVariant.LARGE} onPress={handleUpdate} />
      </View>
    </View>
  );
};
export default TaskListDetail;
