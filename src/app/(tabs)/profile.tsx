import { useAuth } from "@clerk/expo";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";

export default function ProfileScreen() {
  const theme = useTheme();
  const { signOut } = useAuth();

  const onSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <ThemedText style={{ fontSize: 18 }}>👤 Profile Screen</ThemedText>
        <ThemedText style={{ color: theme.onSurfaceVariant }}>
          Coming soon...
        </ThemedText>
        <Button title="Sign Out" onPress={onSignOut} />
      </ThemedView>
    </SafeAreaView>
  );
}
