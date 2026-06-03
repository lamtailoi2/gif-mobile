import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, View } from "react-native";

interface IExerciseSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function ExerciseSearchInput({
  value,
  onChangeText,
  placeholder = "Search exercises...",
}: IExerciseSearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`mx-gutter mb-3 flex-row items-center px-4 py-3 rounded-xl border transition-all ${
        isFocused
          ? "bg-neutral-900/60 border-[#abd600]/40"
          : "bg-neutral-900/30 border-neutral-800/50"
      }`}
    >
      {/* Search Icon */}
      <MaterialIcons
        name="search"
        size={20}
        color={isFocused ? "#abd600" : "#A1A1A1"}
        style={{ marginRight: 12 }}
      />

      {/* Input */}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 text-base text-white font-medium"
        selectionColor="#abd600"
      />

      {/* Clear Button */}
      {value.length > 0 && (
        <MaterialIcons
          name="close"
          size={18}
          color="#6B7280"
          onPress={() => onChangeText("")}
          style={{ cursor: "pointer", marginLeft: 8 }}
        />
      )}
    </View>
  );
}
