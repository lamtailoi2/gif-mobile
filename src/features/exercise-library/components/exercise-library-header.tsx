import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

interface IExerciseLibraryHeaderProps {
  avatarUrl?: string;
  onAvatarPress?: () => void;
}

export default function ExerciseLibraryHeader({
  avatarUrl,
  onAvatarPress,
}: IExerciseLibraryHeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row justify-between items-center px-container-mobile py-4 border-b border-white/10 bg-surface-dim/80">
      {/* Avatar Button */}
      <Pressable
        onPress={onAvatarPress ?? (() => router.push("/profile"))}
        accessibilityLabel="User profile"
        className="w-10 h-10 rounded-full overflow-hidden border border-white/20 active:opacity-80"
      >
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="w-full h-full" />
        ) : (
          <View className="w-full h-full items-center justify-center bg-surface-container-high">
            <MaterialIcons name="person" size={22} color="#A1A1A1" />
          </View>
        )}
      </Pressable>

      {/* Title */}
      <Text className="text-headline-lg-mobile font-display tracking-tighter text-primary-fixed-dim">
        Exercise Library
      </Text>

      {/* Spacer */}
      <View className="w-10" />
    </View>
  );
}
