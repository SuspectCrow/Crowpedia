import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { ICardDetailProps } from "@/app/(root)/card/detail/[id]";
import { SCTaskListEditor } from "@/components/Form/C_SCTaskListEditor";
import { ITaskItem } from "@/interfaces/ICard";
import { createCard, updateCard } from "@/services/appwrite";
import { router } from "expo-router";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";

const TaskListDetail = ({ card, setAvailableActions, registerActionHandler }: ICardDetailProps) => {
  const [tempCard, setTempCard] = React.useState(card);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const rawTaskList = tempCard.content ? JSON.parse(tempCard.content) : [];

  const [taskList, setTaskList] = useState<ITaskItem[]>(rawTaskList);

  const handleUpdate = async () => {
    try {
      if (!tempCard.title) {
        Alert.alert("Error", "Please enter a title");
        return;
      }

      await updateCard(card.$id as string, { ...tempCard, content: JSON.stringify(taskList) });
    } catch (error) {
      console.error("Failed to update note:", error);
      Alert.alert("Error", "Failed to update note. Please try again.");
    }

    router.back();
  };

  const handleTaskListChange = async (newTaskList: ITaskItem[]) => {
    setTaskList(newTaskList);
    try {
      await updateCard(card.$id as string, { ...tempCard, content: JSON.stringify(newTaskList) });
    } catch (error) {
      console.error("Failed to update task list:", error);
    }
  };

  React.useEffect(() => {
    if (setAvailableActions && registerActionHandler) {
      if (isEditMode) {
        setAvailableActions(["save"]);
        registerActionHandler("save", handleUpdate);
      } else {
        setAvailableActions(["edit"]);
        registerActionHandler("edit", () => setIsEditMode(true));
      }
    }
  }, [isEditMode, setAvailableActions, registerActionHandler, handleUpdate]);

  return (
    <View className="mx-3">
      {isEditMode ? (
        <View>
          <SCCoreCardCreateFields card={tempCard} />
        </View>
      ) : (
        <SCTaskListEditor taskList={taskList} onTaskListChange={handleTaskListChange} />
      )}
    </View>
  );
};
export default TaskListDetail;
