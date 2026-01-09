import { View, Text } from "react-native";
import React from "react";
import { ICardDetailProps } from "@/app/(root)/card/detail/[id]";

const TaskListDetail = ({ card }: ICardDetailProps) => {
  return (
    <View>
      <Text>TaskListDetail</Text>
    </View>
  );
};
export default TaskListDetail;
