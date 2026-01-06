import { Alert } from "react-native";
import React, { useState } from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardCreateFields";
import { CardType, CardVariant, ICard, ITaskItem } from "@/interfaces/ICard";
import { createCard } from "@/services/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCTaskListEditor } from "@/components/Form/C_SCTaskListEditor";

const TaskListCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  const [newCard, setNewCard] = useState<ICard>({
    $id: "",
    order: 10,
    title: "",
    content: "[]",
    type: CardType.TASK_LIST,
    background: "#f00",
    variant: CardVariant.SMALL,
  });

  const [taskList, setTaskList] = useState<ITaskItem[]>([]);

  const handleCreate = async () => {
    try {
      if (!newCard.title) {
        Alert.alert("Error", "Please enter a title");
        return;
      }

      const finalCard = {
        ...newCard,
        content: JSON.stringify(taskList),
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

      <SCTaskListEditor taskList={taskList} onTaskListChange={setTaskList} onClose={onClose} onSubmit={handleCreate} />
    </SafeAreaView>
  );
};
export default TaskListCreate;
