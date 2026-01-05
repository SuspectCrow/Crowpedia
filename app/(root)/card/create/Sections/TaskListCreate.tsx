import { View, Alert, Text } from "react-native";
import React, { useState } from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";
import { SCTaskInput } from "@/components/Form/C_SCTaskInput";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardCreateFields";
import { CardType, CardVariant, ICard } from "@/interfaces/ICard";
import { createCard } from "@/services/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import clsx from "clsx";
import { AppTheme } from "@/theme";

interface TaskItem {
  id: string;
  label: string;
  value: boolean;
}

const generateUniqueId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 11);
};

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

  const [taskList, setTaskList] = useState<TaskItem[]>([]);
  const [newTaskLabel, setNewTaskLabel] = useState("");

  const handleAddTask = (label: string) => {
    if (label.trim() === "") return;
    setTaskList((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      { id: generateUniqueId(), label: label, value: false },
    ]);
    setNewTaskLabel("");
  };

  const handleToggleTask = (id: string, value: boolean) => {
    setTaskList((prev) => (Array.isArray(prev) ? prev : []).map((t) => (t.id === id ? { ...t, value } : t)));
  };

  const handleLabelChange = (id: string, label: string) => {
    setTaskList((prev) => (Array.isArray(prev) ? prev : []).map((t) => (t.id === id ? { ...t, label } : t)));
  };

  const handleRemoveTask = (id: string) => {
    setTaskList((prev) => (Array.isArray(prev) ? prev : []).filter((t) => t.id !== id));
  };

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

      <View className="px-3 pb-10 mt-6">
        <Text className={clsx("mb-2 font-medium text-base", AppTheme.colors.text)}>Tasks ( {taskList.length} )</Text>

        {(Array.isArray(taskList) ? taskList : []).map((item) => (
          <View key={item.id} className="mb-2">
            <SCTaskInput
              id={item.id}
              label={item.label}
              onLabelChange={(text) => handleLabelChange(item.id, text)}
              onValueChange={(newValue) => handleToggleTask(item.id, newValue)}
              value={item.value}
              onTaskDeleted={() => handleRemoveTask(item.id)}
            />
          </View>
        ))}
        <View className="flex-row items-center gap-2 mt-2">
          <View className="flex-1">
            <SCTaskInput
              label={newTaskLabel}
              isEditingDefault={true}
              onLabelChange={setNewTaskLabel}
              onTaskSubmit={handleAddTask}
              value={false}
            />
          </View>
          <SCButton variant={ButtonVariant.ICON_ONLY} icon="add" onPress={() => handleAddTask(newTaskLabel)} />
        </View>

        <View className="flex-row items-center justify-center gap-4 mt-8">
          <SCButton text="Cancel" variant={ButtonVariant.LARGE} onPress={onClose} />
          <SCButton text="Create" variant={ButtonVariant.LARGE} className={"bg-green-700"} onPress={handleCreate} />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default TaskListCreate;
