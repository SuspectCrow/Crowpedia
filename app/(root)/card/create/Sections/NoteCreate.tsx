import { View, Text } from "react-native";
import React from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";

const NoteCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  return (
    <View>
      <Text>NoteCreate</Text>
    </View>
  );
};
export default NoteCreate;
