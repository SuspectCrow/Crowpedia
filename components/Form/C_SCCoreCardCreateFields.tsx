import { Pressable, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { SCSelector, SelectorOption } from "@/components/Core/C_SCSelector";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { SCFolderSelect } from "@/components/Form/C_SCFolderSelect";
import { SCColorPicker } from "@/components/Form/C_SCColorPicker";
import { CardType, CardVariant, ICard } from "@/interfaces/ICard";
import { SCInput } from "@/components/Core/C_SCInput";
import { SCCard } from "@/components/S_SCCard";

interface SCCoreCardCreateFieldsProps {
  selectedFolderId?: string;
  onSelect?: (folderId: string) => void;
  card: ICard;
}

export const SCCoreCardCreateFields = ({
  selectedFolderId: initialFolderId,
  onSelect,
  card,
}: SCCoreCardCreateFieldsProps) => {
  const [isCardCoreSettingsCollapsed, setIsCardCoreSettingsCollapsed] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(initialFolderId);

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    onSelect?.(folderId);
    card.parentFolder = folderId;
  };

  const [selectedCardVariant, setSelectedCardVariant] = useState("small");
  const cardVariants: SelectorOption[] = useMemo(() => {
    return Object.values(CardVariant).map((type) => ({
      key: type,
      title: type,
    }));
  }, []);

  const [backgroundColor, setBackgroundColor] = useState("#ff0000");
  const [backgroundURL, setBackgroundURL] = useState("");
  const [title, setTitle] = useState("");

  return (
    <View className="mx-3 mt-4">
      <SCInput
        label="Title"
        placeholder="Enter a Title"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          card.title = text;
        }}
      />
      <View className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
        <Pressable
          className="flex-row justify-between items-center p-3"
          onPress={() => setIsCardCoreSettingsCollapsed(!isCardCoreSettingsCollapsed)}
        >
          <Text className="text-neutral-300 font-dmsans-semibold text-xl">Apperance and Location</Text>
          <MaterialIcons
            name={isCardCoreSettingsCollapsed ? "arrow-upward" : "arrow-downward"}
            size={24}
            color={colors.neutral["300"]}
          />
        </Pressable>
        {isCardCoreSettingsCollapsed && (
          <View className="mt-4">
            <SCFolderSelect selectedFolderId={selectedFolderId} onSelect={handleSelectFolder} />
            <SCSelector
              options={cardVariants}
              selectedKey={selectedCardVariant}
              onSelect={(key) => {
                setSelectedCardVariant(key);
                card.variant = key as CardVariant;
                card.background = "https://free-images.com/lg/d995/oregon_coast_pacific_seashore.jpg";
              }}
              className="mt-4"
            />

            {(selectedCardVariant === CardVariant.SMALL || selectedCardVariant === CardVariant.LARGE) && (
              <View className="flex-1 bg-neutral-950 border border-neutral-900 rounded-xl mt-4 p-5 justify-center">
                <SCColorPicker
                  label="Bacground Color"
                  value={backgroundColor}
                  onChange={(newColor) => {
                    setBackgroundColor(newColor);
                    card.background = newColor;
                  }}
                />
              </View>
            )}

            {selectedCardVariant === CardVariant.PORTRAIT && (
              <View className="mt-4">
                <View className="flex-col items-center">
                  <SCInput
                    label="Background URL"
                    placeholder="Enter a image URL"
                    value={backgroundURL}
                    onChangeText={(text) => {
                      setBackgroundURL(text);
                      card.background = text;
                    }}
                  />
                  <SCCard
                    card={{
                      $id: "null",
                      title: title ? title : "Lorem Ipsum",
                      background: backgroundURL
                        ? backgroundURL
                        : "https://free-images.com/lg/d995/oregon_coast_pacific_seashore.jpg",
                      type: CardType.FOLDER,
                      order: 0,
                      variant: CardVariant.PORTRAIT,
                    }}
                    className="w-1/2"
                  />
                </View>
              </View>
            )}

            {(selectedCardVariant === CardVariant.SMALL || selectedCardVariant === CardVariant.LARGE) && (
              <View className="mt-4 flex-col items-center">
                <SCCard
                  card={{
                    $id: "null",
                    title: title ? title : "Lorem Ipsum",
                    background: backgroundColor ? backgroundColor : "#ff0000",
                    type: CardType.FOLDER,
                    order: 0,
                    variant: selectedCardVariant,
                  }}
                  className="w-1/2"
                />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};
