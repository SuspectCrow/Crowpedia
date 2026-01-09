import "react-native-get-random-values";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { createCard } from "@/services/appwrite";
import { ICard, CardType, CardVariant } from "@/interfaces/ICard";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCInput, InputVariant } from "@/components/Core/C_SCInput";
import { SCButton, ButtonVariant } from "@/components/Core/C_SCButton";
import { SCCoreCardCreateFields } from "@/components/Form/C_SCCoreCardFields";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";
import CryptoJS from "crypto-js";

const PasswordCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  const [newCard, setNewCard] = useState<ICard>({
    $id: "",
    order: 10,
    title: "",
    content: "",
    type: CardType.PASSWORD,
    background: "#dc2626",
    variant: CardVariant.SMALL,
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  };

  const handleCreate = async () => {
    if (!newCard.title.trim()) {
      Alert.alert("Missing Information", "Please enter a title.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Missing Information", "Please enter a password.");
      return;
    }

    const encryptionKey = process.env.EXPO_PUBLIC_ENCRYPTION_KEY;

    if (!encryptionKey) {
      Alert.alert("Configuration Error", "Encryption key is missing. Cannot save password securely.");
      return;
    }

    try {
      const encryptedPassword = CryptoJS.AES.encrypt(password.trim(), encryptionKey).toString();

      const contentObj = {
        username: username.trim(),
        password: encryptedPassword,
        website: website.trim(),
        notes: notes.trim(),
      };

      const finalCard = {
        ...newCard,
        content: JSON.stringify(contentObj),
      };

      await createCard(finalCard);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create password:", error);
      Alert.alert("Error", "Failed to create password. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <SCCoreCardCreateFields card={newCard} />

      <View className="mx-3 mt-6">
        <SCInput
          label="Website"
          placeholder="https://example.com"
          value={website}
          onChangeText={setWebsite}
          keyboardType="url"
          autoCapitalize="none"
          variant={InputVariant.DEFAULT}
        />

        <SCInput
          label="Username / Email"
          placeholder="user@example.com"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          variant={InputVariant.DEFAULT}
        />

        <SCInput
          label="Password *"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          variant={InputVariant.DEFAULT}
          rightIcon={showPassword ? "visibility-off" : "visibility"}
          onRightIconPress={() => setShowPassword(!showPassword)}
        />

        <View className="flex-row gap-3 mb-4">
          <SCButton
            text="Generate Password"
            icon="autorenew"
            variant={ButtonVariant.MEDIUM}
            onPress={generatePassword}
            className="flex-1 bg-blue-700"
          />
        </View>

        <SCInput
          label="Notes"
          placeholder="Additional information..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          variant={InputVariant.DEFAULT}
          autoHeight
        />

        <View className="flex-row items-center justify-center gap-4 mt-8">
          <SCButton text="Cancel" variant={ButtonVariant.LARGE} onPress={onClose} transparent />
          <SCButton text="Save" variant={ButtonVariant.LARGE} className="bg-green-700" onPress={handleCreate} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PasswordCreate;
