import { View, Text } from "react-native";
import React from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";

const PasswordCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  return (
    <View>
      <Text>PasswordCreate</Text>
    </View>
  );
};
export default PasswordCreate;
