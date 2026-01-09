import { View, Text } from "react-native";
import React from "react";
import { ICardDetailProps } from "@/app/(root)/card/detail/[id]";

const EventDetail = ({ card }: ICardDetailProps) => {
  return (
    <View>
      <Text>EventDetail</Text>
    </View>
  );
};
export default EventDetail;
