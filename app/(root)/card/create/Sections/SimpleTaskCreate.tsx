import { View, Text } from "react-native";
import React from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";

const SimpleTaskCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  return (
    <View>
      <Text>SimpleTaskCreate</Text>
    </View>
  );
};
export default SimpleTaskCreate;
