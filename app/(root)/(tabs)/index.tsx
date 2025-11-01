import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: '#292524',
      }}
    >
      <Text className=" font-dmsans-black text-4xl text-red-600">Index</Text>
    </View>
  );
}