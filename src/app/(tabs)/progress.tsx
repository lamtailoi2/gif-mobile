import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgressScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText style={{ fontSize: 18 }}>📊 Progress Screen</ThemedText>
        <ThemedText style={{ color: theme.onSurfaceVariant, marginTop: 8 }}>
          Coming soon...
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
