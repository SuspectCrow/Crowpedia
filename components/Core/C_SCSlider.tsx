import React, { useRef, useState } from "react";
import { View, Text, PanResponder, Platform, UIManager } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import colors from "tailwindcss/colors";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SCSliderProps {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  showSteps?: boolean;
  className?: string;
}

export const SCSlider: React.FC<SCSliderProps> = ({
  label = "Value",
  min,
  max,
  step = 1,
  value,
  onValueChange,
  showSteps = true,
  className,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const valuesRef = useRef({
    min,
    max,
    step,
    value,
    containerWidth,
    onValueChange,
  });

  valuesRef.current = {
    min,
    max,
    step,
    value,
    containerWidth,
    onValueChange,
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (evt) => {
        const { min, max, step, containerWidth, onValueChange } = valuesRef.current;
        if (containerWidth === 0) return;

        const { locationX } = evt.nativeEvent;
        const clampedX = Math.min(Math.max(locationX, 0), containerWidth);
        const percentage = clampedX / containerWidth;
        const rawValue = percentage * (max - min) + min;

        const steps = Math.round((rawValue - min) / step);
        const steppedValue = steps * step + min;
        const finalValue = Math.min(Math.max(steppedValue, min), max);

        onValueChange(finalValue);
      },

      onPanResponderMove: (evt) => {
        const { min, max, step, containerWidth, onValueChange } = valuesRef.current;
        if (containerWidth === 0) return;

        const { locationX } = evt.nativeEvent;
        const clampedX = Math.min(Math.max(locationX, 0), containerWidth);
        const percentage = clampedX / containerWidth;
        const rawValue = percentage * (max - min) + min;

        const steps = Math.round((rawValue - min) / step);
        const steppedValue = steps * step + min;
        const finalValue = Math.min(Math.max(steppedValue, min), max);

        onValueChange(finalValue);
      },
    }),
  ).current;

  const percentage = (value - min) / (max - min);
  const opacityLevel = 0.3 + percentage * 0.7;

  const stepPoints = [];
  if (showSteps) {
    for (let i = min; i <= max; i += step) {
      stepPoints.push(i);
    }
  }

  return (
    <View className={clsx("w-full py-2", className)}>
      <View className="flex-row justify-between items-end mb-3 px-1">
        <Text className="text-[#9ca3af] font-dmsans text-base font-medium">{label}</Text>
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="flag" size={18} color={colors.neutral[500]} />
          <Text className="text-[#9ca3af] font-dmsans text-base font-bold">
            <Text className="text-white">{value}</Text>
            <Text className="text-[#52525b]">/{max}</Text>
          </Text>
        </View>
      </View>

      <View
        className="h-10 justify-center"
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <View
          pointerEvents="none"
          className="h-3 rounded-full bg-neutral-300"
          style={{
            width: `${percentage * 100}%`,
            opacity: opacityLevel,
            minWidth: percentage === 0 && min === value ? 12 : 0,
          }}
        />

        {showSteps && (
          <View pointerEvents="none" className="absolute bottom-0 w-full h-1">
            {stepPoints.map((pointVal) => {
              const pointPercent = (pointVal - min) / (max - min);
              return (
                <View
                  key={pointVal}
                  className="absolute w-1 h-1 rounded-full bg-[#52525b]"
                  style={{
                    left: `${pointPercent * 100}%`,
                    marginLeft: -2,
                    bottom: -8,
                  }}
                />
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};
