import { Button } from '@/components/ui/button';
import { PersonalInfoSection } from '@/features/profile/components/personal-info-section';
import { ProfileHeader } from '@/features/profile/components/profile-header';
import { TrainingGoalsSection } from '@/features/profile/components/training-goals-section';
import { useAuth } from '@clerk/expo';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { signOut } = useAuth();

  const onSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className="absolute top-0 left-0 right-0 h-[420px]"
        style={{
          experimental_backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(171,214,0,0.1) 0%, rgba(19,19,19,1) 65%)',
        } as object}
      />

      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          contentContainerClassName="px-container-mobile pt-6 pb-[140px]"
          showsVerticalScrollIndicator={false}
        >
          <ProfileHeader />
          <PersonalInfoSection />
          <TrainingGoalsSection />

          <Button variant="outline" onPress={onSignOut}>
            Sign Out
          </Button>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
