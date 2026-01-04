import React, { useState } from "react";
import { Modal, Text, View } from "react-native";
import ColorPicker, { HueSlider, OpacitySlider, Panel1, Preview } from "reanimated-color-picker";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";

interface SCColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  containerClassName?: string;
}

export const SCColorPicker: React.FC<SCColorPickerProps> = ({ label, value, onChange, containerClassName }) => {
  const [showModal, setShowModal] = useState(false);
  const [tempColor, setTempColor] = useState(value);

  const handleOpen = () => {
    setTempColor(value);
    setShowModal(true);
  };

  const handleConfirm = () => {
    onChange(tempColor);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <View className={containerClassName}>
      {label && <Text className="text-[#9ca3af] font-dmsans mb-2 text-sm ml-1">{label}</Text>}

      {}
      <View className="flex-row items-center gap-3">
        {}
        <View className="flex-1 flex-row items-center gap-3 h-12 px-3 rounded-xl bg-[#171717] border border-[#262626]">
          <View className="w-6 h-6 rounded border border-white/10" style={{ backgroundColor: value }} />
          <Text className="text-white font-dmsans text-base font-medium">{value.toUpperCase()}</Text>
        </View>

        {}
        <SCButton
          text="Change"
          icon="format-color-fill"
          variant={ButtonVariant.DEFAULT}
          onPress={handleOpen}
          className="bg-[#262626] border-0"
        />
      </View>

      {}
      <Modal visible={showModal} animationType="fade" transparent={true} onRequestClose={handleCancel}>
        <View className="flex-1 justify-center items-center bg-black/80 px-4">
          <View className="w-full max-w-sm bg-[#171717] rounded-2xl border border-[#262626] p-6">
            <Text className="text-white font-dmsans text-xl font-medium mb-6 text-center">Pick a Color</Text>

            {}
            <ColorPicker
              style={{ width: "100%", gap: 20 }}
              value={tempColor}
              onChangeJS={({ hex }) => setTempColor(hex)}
            >
              <Preview hideInitialColor style={{ height: 40, borderRadius: 10 }} />
              <Panel1 style={{ borderRadius: 10, height: 150 }} />
              <HueSlider style={{ borderRadius: 10, height: 20 }} />
              <OpacitySlider style={{ borderRadius: 10, height: 20 }} />
            </ColorPicker>

            {}
            <View className="flex-row gap-3 mt-6">
              <View className="flex-1">
                <SCButton
                  text="Cancel"
                  onPress={handleCancel}
                  variant={ButtonVariant.DEFAULT}
                  transparent={true}
                  className="w-full border border-[#262626]"
                />
              </View>
              <View className="flex-1">
                <SCButton
                  text="Apply"
                  onPress={handleConfirm}
                  variant={ButtonVariant.DEFAULT}
                  className="w-full bg-green-700"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
