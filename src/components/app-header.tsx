import { GIFColors } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { useUser } from "@clerk/expo";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";

interface IAppHeaderProps {
  title?: string;
  avatarUrl?: string;
  hasNotification?: boolean;
  onAvatarPress?: () => void;
  onNotificationPress?: () => void;
}

export default function AppHeader({
  title = "G.I.F",
  avatarUrl,
  hasNotification = false,
  onAvatarPress,
  onNotificationPress,
}: IAppHeaderProps) {
  const router = useRouter();
  const { user } = useUser();
  const { data: notifications = [] } = useNotifications(user?.id || '');
  
  const hasUnread = notifications.some((n) => !n.isRead);
  const showBadge = hasNotification || hasUnread;

  return (
    <View className="flex-row justify-between items-center px-container-mobile py-4 border-b border-white/10 bg-surface-dim/80">
      <Pressable
        onPress={onAvatarPress ?? (() => router.push("/profile"))}
        accessibilityLabel="User profile"
        className="w-10 h-10 rounded-full overflow-hidden border border-white/20 active:opacity-80"
      >
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="w-full h-full" />
        ) : (
          <View className="w-full h-full items-center justify-center bg-surface-container-high">
            <MaterialIcons
              name="person"
              size={22}
              color={GIFColors.onSurfaceVariant}
            />
          </View>
        )}
      </Pressable>

      <Text className="text-headline-lg-mobile font-display tracking-tighter text-primary-fixed-dim">
        {title}
      </Text>

      <Pressable
        onPress={onNotificationPress ?? (() => router.push("/notifications"))}
        accessibilityLabel="Notifications"
        className="relative w-10 h-10 items-center justify-center active:opacity-80"
      >
        <MaterialIcons
          name="notifications"
          size={24}
          color={GIFColors.onSurfaceVariant}
        />
        {showBadge && (
          <View
            className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-fixed-dim"
            style={{
              shadowColor: GIFColors.primaryFixedDim,
              shadowOpacity: 0.8,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 0 },
              elevation: 6,
            }}
          />
        )}
      </Pressable>
    </View>
  );
}
