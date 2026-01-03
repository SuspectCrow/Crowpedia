import { View, Text } from "react-native";
import React from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";

const EventCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  return (
    <View>
      <Text>EventCreate</Text>
    </View>
  );
};
export default EventCreate;
