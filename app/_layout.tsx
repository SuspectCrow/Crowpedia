import { SplashScreen, Stack } from "expo-router";

import "./global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
// import setColorScheme = Appearance.setColorScheme;

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    "DMSans-Black": require("../assets/fonts/DMSans-Black.ttf"),
    "DMSans-Bold": require("../assets/fonts/DMSans-Bold.ttf"),
    "DMSans-ExtraBold": require("../assets/fonts/DMSans-ExtraBold.ttf"),
    "DMSans-ExtraLight": require("../assets/fonts/DMSans-ExtraLight.ttf"),
    "DMSans-Light": require("../assets/fonts/DMSans-Light.ttf"),
    "DMSans-Medium": require("../assets/fonts/DMSans-Medium.ttf"),
    "DMSans-Regular": require("../assets/fonts/DMSans-Regular.ttf"),
    "DMSans-Semibold": require("../assets/fonts/DMSans-SemiBold.ttf"),
    "DMSans-Thin": require("../assets/fonts/DMSans-Thin.ttf"),
  });

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  if (!fontLoaded) return null;

  // setColorScheme('dark');

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0a0a0a" },
      }}
    />
  );
}
