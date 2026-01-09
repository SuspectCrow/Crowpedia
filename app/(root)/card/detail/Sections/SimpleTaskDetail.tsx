import { View, Text } from "react-native";
import React from "react";
import { ICardDetailProps } from "@/app/(root)/card/detail/[id]";

const SimpleTaskDetail = ({ card }: ICardDetailProps) => {
  return (
    <View>
      <Text>SimpleTaskDetail</Text>
    </View>
  );
};
export default SimpleTaskDetail;
