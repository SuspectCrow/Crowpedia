import { View, Text } from "react-native";
import React, { useState } from "react";
import { SCTaskInput } from "@/components/Form/C_SCTaskInput";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import clsx from "clsx";
import { AppTheme } from "@/theme";
import { ITaskItem } from "@/interfaces/ICard";

interface SCTaskListEditorProps {
  taskList: ITaskItem[];
  onTaskListChange: (tasks: ITaskItem[]) => void;
}

const generateUniqueId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 11);
};

export const SCTaskListEditor = ({ taskList, onTaskListChange }: SCTaskListEditorProps) => {
  const [newTaskLabel, setNewTaskLabel] = useState("");

  const handleAddTask = (label: string) => {
    if (label.trim() === "") return;
    const newTasks = [
      ...(Array.isArray(taskList) ? taskList : []),
      { id: generateUniqueId(), label: label, value: false },
    ];
    onTaskListChange(newTasks);
    setNewTaskLabel("");
  };

  const handleToggleTask = (id: string, value: boolean) => {
    const newTasks = (Array.isArray(taskList) ? taskList : []).map((t) => (t.id === id ? { ...t, value } : t));
    onTaskListChange(newTasks);
  };

  const handleLabelChange = (id: string, label: string) => {
    const newTasks = (Array.isArray(taskList) ? taskList : []).map((t) => (t.id === id ? { ...t, label } : t));
    onTaskListChange(newTasks);
  };

  const handleRemoveTask = (id: string) => {
    const newTasks = (Array.isArray(taskList) ? taskList : []).filter((t) => t.id !== id);
    onTaskListChange(newTasks);
  };

  return (
    <View className="px-3 pb-10 mt-6">
      <Text className={clsx("mb-2 font-medium text-base", AppTheme.colors.text)}>
        Tasks ( {taskList?.length || 0} )
      </Text>

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
    </View>
  );
};
