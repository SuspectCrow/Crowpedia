import { Alert, Text, View } from "react-native";
import React, { useState } from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardCreateFields";
import { InputVariant, SCInput } from "@/components/Core/C_SCInput";
import { ButtonVariant, SCButton } from "@/components/Core/C_SCButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardType, CardVariant, ICard } from "@/interfaces/ICard";
import { createCard } from "@/services/appwrite";
import { SCSwitch } from "@/components/Core/C_SCSwitch";
import { SCSlider } from "@/components/Core/C_SCSlider";
import { SCDatePicker } from "@/components/Core/C_SCDatePicker";
import { SCTimePicker } from "@/components/Core/C_SCTimePicker";

const EventCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  const [newCard, setNewCard] = useState<ICard>({
    $id: "",
    order: 10,
    title: "",
    content: "[]",
    type: CardType.EVENT,
    background: "#f00",
    variant: CardVariant.SMALL,
  });

  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleCreate = async () => {
    try {
      if (!newCard.title) {
        Alert.alert("Error", "Please enter a title");
        return;
      }

      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(selectedTime.getHours());
      combinedDate.setMinutes(selectedTime.getMinutes());
      combinedDate.setSeconds(0);

      const timestamp = Math.floor(combinedDate.getTime() / 1000).toString();

      const finalCard = {
        ...newCard,
        content: JSON.stringify({
          timestamp: timestamp,
          description: description,
          location: location,
          isOnline: isOnlineEvent,
          importance: importance,
        }),
      };

      await createCard(finalCard);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create event:", error);
      Alert.alert("Error", "Failed to create event. Please try again.");
    }
  };

  const [isOnlineEvent, setIsOnlineEvent] = useState(false);

  const [importance, setImportance] = useState(3);

  const [customValue, setCustomValue] = useState(6);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  return (
    <SafeAreaView className="flex-1">
      <SCCoreCardCreateFields card={newCard} />

      <View className="mx-3 mt-6">
        <SCInput
          label="Description"
          placeholder="Enter a desciription..."
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            newCard.content = text;
          }}
        />
        <View className="mt-6">
          <SCSwitch label="Is Online?" icon="language" value={isOnlineEvent} onValueChange={setIsOnlineEvent} />
          <View className="mt-6">
            {isOnlineEvent ? (
              <View className="flex-row items-start gap-2">
                <View className="flex-1">
                  <SCInput label="Link" variant={InputVariant.DEFAULT} />
                </View>
                <SCButton variant={ButtonVariant.ICON_ONLY_MEDIUM} icon="link" className="mt-auto mb-4" />
              </View>
            ) : (
              <SCInput label="Location" variant={InputVariant.DEFAULT} />
            )}
          </View>
          <SCSlider
            label="Importance"
            min={1}
            max={5}
            step={1}
            value={importance}
            onValueChange={setImportance}
            showSteps={true}
          />
          <View className="flex-row items-center justify-center gap-2 mt-8">
            <SCDatePicker value={selectedDate} onChange={setSelectedDate} label="Date" />
            <SCTimePicker value={selectedTime} onChange={setSelectedTime} label="Time" />
          </View>
        </View>
        <View className="flex-row items-center justify-center gap-4 mt-8">
          <SCButton text="Cancel" variant={ButtonVariant.LARGE} onPress={onClose} />
          <SCButton text="Create" variant={ButtonVariant.LARGE} onPress={handleCreate} />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default EventCreate;
