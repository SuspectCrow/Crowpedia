import { View, Text, Platform } from "react-native";
import { Tabs } from "expo-router";
import colors from "tailwindcss/colors";

import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
}) => (
  <View className="flex-1 flex flex-col items-center">
    <MaterialIcons name={icon} size={28} color={focused ? colors.stone["300"] : colors.stone["500"]} />
  </View>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          position: "absolute",
          borderTopColor: colors.neutral["800"],
          elevation: 0,
          borderTopWidth: 1,
          paddingTop: 12,
          minHeight: 112,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={Platform.OS === "android" ? 2 : 20}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            className="absolute inset-0 border-t border-white/10"
            style={{ backgroundColor: `${colors.neutral["950"]}cc` }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="home" title="Home" />,
        }}
      />
      <Tabs.Screen
        name="folders"
        options={{
          title: "Folders",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="folder" title="Folders" />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="search" title="Search" />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="calendar-month" title="Calendar" />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
