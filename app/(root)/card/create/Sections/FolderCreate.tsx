import { View, Text, Pressable, Linking, Alert } from "react-native";
import React, { useMemo, useState } from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { SCFolderSelect } from "@/components/Form/C_SCFolderSelect";
import { SCSelector, SelectorOption } from "@/components/Core/C_SCSelector";
import { TagOption } from "@/components/Core/C_SCTagSelector";
import { CardType, CardVariant, getCardIcon } from "@/interfaces/ICard";
import { SCColorPicker } from "@/components/Form/C_SCColorPicker";
import { SCInput } from "@/components/Core/C_SCInput";

const FolderCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  const [isCardCoreSettingsColapsed, setIsCardCoreSettingsColapsed] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();

  const [selectedCardVariant, setSelectedCardVariant] = useState("small");
  const cardVariants: SelectorOption[] = useMemo(() => {
    return Object.values(CardVariant).map((type) => ({
      key: type,
      title: type,
    }));
  }, []);

  const [backgroundColor, setBackgroundColor] = useState("#ff0000");
  const [backgroundURL, setBackgroundURL] = useState("");

  return (
    <View>
      <View className="bg-neutral-900 border border-neutral-800 rounded-xl mx-3 p-3">
        <Pressable
          className="flex-row justify-between items-center mb-6"
          onPress={() => setIsCardCoreSettingsColapsed(!isCardCoreSettingsColapsed)}
        >
          <Text className="text-neutral-300 font-dmsans-semibold text-xl">Apperance and Location</Text>
          <MaterialIcons
            name={isCardCoreSettingsColapsed ? "arrow-upward" : "arrow-downward"}
            size={24}
            color={colors.neutral["300"]}
          />
        </Pressable>
        {isCardCoreSettingsColapsed && (
          <View className="mb-4">
            <SCFolderSelect
              selectedFolderId={selectedFolderId}
              onSelect={(folderId) => setSelectedFolderId(folderId)}
            />
            <SCSelector
              options={cardVariants}
              selectedKey={selectedCardVariant}
              onSelect={(key) => {
                setSelectedCardVariant(key);
              }}
              className="mt-4"
            />

            {(selectedCardVariant === CardVariant.SMALL || selectedCardVariant === CardVariant.LARGE) && (
              <View className="flex-1 bg-neutral-950 border border-neutral-900 rounded-xl mt-4 p-5 justify-center">
                <SCColorPicker
                  label="Bacground Color"
                  value={backgroundColor}
                  onChange={(newColor) => setBackgroundColor(newColor)}
                />
              </View>
            )}

            {selectedCardVariant === CardVariant.PORTRAIT && (
              <View className="mt-4">
                <SCInput
                  label="Background URL"
                  placeholder="Enter a image URL"
                  value={backgroundURL}
                  onChange={(text) => setBackgroundURL(text)}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};
export default FolderCreate;
