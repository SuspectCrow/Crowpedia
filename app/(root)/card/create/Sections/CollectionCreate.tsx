import { View, Text } from "react-native";
import React from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";

const CollectionCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  return (
    <View>
      <Text>CollectionCreate</Text>
    </View>
  );
};
export default CollectionCreate;
