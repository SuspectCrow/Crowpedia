import React, { useRef, useState } from "react";
import { ScrollView, View, TouchableOpacity, Text, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { actions, FONT_SIZE, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { MaterialIcons } from "@expo/vector-icons";
import { AppTheme } from "@/theme";
import clsx from "clsx";
import { SafeAreaView } from "react-native-safe-area-context";

interface SCTextEditorProps {
  label?: string;
  initialValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  containerClassName?: string;
  editorStyle?: any;
  minHeight?: number;
  onImagePress?: () => void;
  visible: boolean;
  onDonePressed?: () => void;
  ListHeaderComponent?: React.ReactElement | null;
}

export const SCTextEditor: React.FC<SCTextEditorProps> = ({
  label,
  initialValue = "",
  onChange,
  placeholder = "Start writing notes...",
  containerClassName,
  editorStyle,
  minHeight = 300,
  onImagePress,
  visible,
  onDonePressed,
  ListHeaderComponent,
}) => {
  const richText = useRef<RichEditor>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHilitePicker, setShowHilitePicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);

  const colors = [
    "#FFFFFF",
    "#000000",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#9e9e9e",
    "#607d8b",
  ];
  const fontSizes = [1, 2, 3, 4, 5, 6, 7];

  const richTextHandle = (descriptionText: string) => {
    onChange?.(descriptionText);
  };

  const handleForeColor = () => {
    setShowColorPicker(!showColorPicker);
    setShowHilitePicker(false);
    setShowFontSizePicker(false);
  };

  const handleHiliteColor = () => {
    setShowHilitePicker(!showHilitePicker);
    setShowColorPicker(false);
    setShowFontSizePicker(false);
  };

  const handleFontSize = () => {
    setShowFontSizePicker(!showFontSizePicker);
    setShowColorPicker(false);
    setShowHilitePicker(false);
  };

  const onColorSelect = (color: string) => {
    richText.current?.setForeColor(color);
    setShowColorPicker(false);
  };

  const onHiliteSelect = (color: string) => {
    richText.current?.setHiliteColor(color);
    setShowHilitePicker(false);
  };

  const onFontSizeSelect = (size: number) => {
    richText.current?.setFontSize(size as FONT_SIZE);
    setShowFontSizePicker(false);
  };

  const renderColorPicker = (onSelect: (color: string) => void) => (
    <View className="bg-neutral-800 py-2 px-1 border-t border-neutral-700 flex-row">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              marginHorizontal: 5,
              borderWidth: 1,
              borderColor: "#404040",
              backgroundColor: color,
            }}
            onPress={() => onSelect(color)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderFontSizePicker = () => (
    <View className="bg-neutral-800 py-2 px-1 border-t border-neutral-700 flex-row">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {fontSizes.map((size, index) => (
          <TouchableOpacity
            key={index}
            className="w-10 h-8 justify-center items-center mx-1 bg-neutral-700 rounded"
            onPress={() => onFontSizeSelect(size as FONT_SIZE)}
          >
            <Text className="text-white" style={{ fontSize: 10 + size * 2 }}>
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderDefaultHeader = () => (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-800">
      <Text className="text-white font-dmsans-medium text-lg">{label || "Editor"}</Text>
      <TouchableOpacity onPress={onDonePressed} className="bg-neutral-800 px-4 py-1.5 rounded-lg">
        <Text className="text-white font-dmsans-medium">Done</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onDonePressed}>
      <SafeAreaView className="flex-1 bg-neutral-900">
        {ListHeaderComponent ? ListHeaderComponent : renderDefaultHeader()}

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View className="flex-1 bg-neutral-900">
            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
              <RichEditor
                ref={richText}
                onChange={richTextHandle}
                placeholder={placeholder}
                // androidHardwareAccelerationDisabled={true}
                initialContentHTML={initialValue}
                editorStyle={{
                  backgroundColor: "#171717", // neutral-900 approx
                  color: "#ffffff",
                  placeholderColor: "#6b7280",
                  contentCSSText: "font-size: 16px; min-height: 100%; padding: 10px;",
                  ...editorStyle,
                }}
              />
            </ScrollView>

            {showColorPicker && renderColorPicker(onColorSelect)}
            {showHilitePicker && renderColorPicker(onHiliteSelect)}
            {showFontSizePicker && renderFontSizePicker()}

            <RichToolbar
              editor={richText}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.setStrikethrough,
                actions.heading1,
                actions.fontSize,
                actions.foreColor,
                actions.hiliteColor,
                actions.alignLeft,
                actions.alignCenter,
                actions.alignRight,
                actions.alignFull,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.checkboxList,
                actions.insertLink,
                actions.insertImage,
                actions.undo,
                actions.redo,
                actions.keyboard,
              ]}
              iconMap={{
                [actions.foreColor]: ({ tintColor }: any) => (
                  <View style={{ alignItems: "center" }}>
                    <MaterialIcons name="format-color-text" size={20} color={tintColor} />
                    <View style={{ height: 2, width: 16, backgroundColor: tintColor, marginTop: -2 }} />
                  </View>
                ),
                [actions.hiliteColor]: ({ tintColor }: any) => (
                  <MaterialIcons name="format-color-fill" size={20} color={tintColor} />
                ),
                [actions.fontSize]: ({ tintColor }: any) => (
                  <MaterialIcons name="format-size" size={20} color={tintColor} />
                ),
              }}
              foreColor={handleForeColor}
              hiliteColor={handleHiliteColor}
              fontSize={handleFontSize}
              iconTint={"#a3a3a3"}
              selectedIconTint={"#ffffff"}
              disabledIconTint={"#404040"}
              onPressAddImage={onImagePress}
              style={{
                backgroundColor: "#262626", // neutral-800 approx
                borderTopWidth: 1,
                borderTopColor: "#404040",
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};
