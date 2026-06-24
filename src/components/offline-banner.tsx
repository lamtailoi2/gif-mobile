import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useNetwork } from "@/hooks/use-network";

export function OfflineBanner() {
  const isOnline = useNetwork();
  if (isOnline) return null;
  return (
    <ThemedView className="bg-amber-500 px-4 py-2">
      <ThemedText className="text-white text-center text-sm font-medium">
        You are offline — showing cached data
      </ThemedText>
    </ThemedView>
  );
}
