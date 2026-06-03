import { useUser } from '@clerk/expo';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

export function ProfileHeader() {
  const { user } = useUser();

  const firstName = user?.firstName ?? '';
  const lastName = user?.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Athlete';
  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
    fullName.charAt(0).toUpperCase();

  return (
    <View className="flex-row items-center gap-4 mb-6">
      <View className="w-16 h-16 rounded-full overflow-hidden items-center justify-center bg-neon-green/15 border border-neon-green/30">
        {user?.hasImage ? (
          <Image
            source={{ uri: user.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <Text className="font-display text-2xl font-extrabold text-neon-green">{initials}</Text>
        )}
      </View>
      <View className="flex-1">
        <Text className="font-display text-[24px] font-extrabold text-on-surface tracking-[-0.48px]">
          {fullName}
        </Text>
        {!!email && (
          <Text className="font-body text-sm text-on-surface-variant mt-0.5">{email}</Text>
        )}
      </View>
    </View>
  );
}
