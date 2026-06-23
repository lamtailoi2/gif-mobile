import { useUser } from '@clerk/expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '@/components/app-header';
import { useTheme } from '@/hooks/use-theme';
import CoachFeature from '@/features/coach/coach';

export default function CoachScreen() {
  const theme = useTheme();
  const { user } = useUser();

  const avatarUrl = user?.imageUrl;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={['top']}
    >
      <AppHeader title="G.I.F" avatarUrl={avatarUrl} />
      <CoachFeature />
    </SafeAreaView>
  );
}
