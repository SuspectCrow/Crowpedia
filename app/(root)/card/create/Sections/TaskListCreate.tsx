import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { CreateCardProps } from "@/app/(root)/card/create/[type]";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCCheckBox } from "@/components/Core/C_SCCheckBox";
import { SCTaskInput } from "@/components/Form/C_SCTaskInput";

const TaskListCreate = ({ onClose, onSuccess }: CreateCardProps) => {
  const [checked, setChecked] = useState(false);
  const [label, setLabel] = useState("Deneme");

  return (
    <SafeAreaView>
      <ScrollView className="px-3">
        <SCTaskInput
          label={label}
          onLabelChange={setLabel}
          onValueChange={(newValue) => {
            console.log(newValue);
            setChecked(newValue);
          }}
          value={checked}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
export default TaskListCreate;
