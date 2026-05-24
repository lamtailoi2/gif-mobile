import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { useAuth } from '@clerk/expo';
import { Button, Pressable } from 'react-native';

export default function HomeScreen() {
  const { signOut } = useAuth();
  const onSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <ThemedView className="flex-1 justify-center flex-row">
      <SafeAreaView
        className="flex-1 px-6 items-center gap-4"
        style={{
          paddingBottom: BottomTabInset + 16,
          maxWidth: MaxContentWidth,
        }}>
        <Pressable onPress={() => console.log('Sign out pressed')} className="mt-6">
          <ThemedText type="small">
            Sign Out
          </ThemedText>
        </Pressable>
        <Button title="Sign Out" onPress={onSignOut} />
      </SafeAreaView>
    </ThemedView>
  );
}