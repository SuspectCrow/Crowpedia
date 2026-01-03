import { View, Text } from "react-native";
import React from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";

const TaskListCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  return (
    <View>
      <Text>TaskListCreate</Text>
    </View>
  );
};
export default TaskListCreate;
