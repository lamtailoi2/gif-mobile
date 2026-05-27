import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GIFColors } from '@/constants/theme';
import { useAuthLoading } from '@/context/auth-loading-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn, useSSO } from '@clerk/expo';
import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

type SignInForm = z.infer<typeof signInSchema>;

export const SignIn = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [loadingAction, setLoadingAction] = useState<'email' | 'google' | null>(null);

  const { isLoading, setLoading } = useAuthLoading();
  const { signIn } = useSignIn();
  const { startSSOFlow } = useSSO();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onGooglePress = async () => {
    if (isLoading) return;
    setApiError('');
    setLoadingAction('google');
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: Linking.createURL('/'),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      setApiError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Google sign-in failed');
    } finally {
      setLoadingAction(null);
      setLoading(false);
    }
  };

  const onSignIn = async (data: SignInForm) => {
    if (!signIn || isLoading) return;
    setApiError('');
    setLoadingAction('email');
    setLoading(true);
    try {
      const { error: createError } = await signIn.create({ identifier: data.email, password: data.password });
      if (createError) {
        setApiError(createError.longMessage ?? createError.message ?? 'Sign in failed');
        return;
      }
      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        setApiError(finalizeError.longMessage ?? finalizeError.message ?? 'Sign in failed');
      }
    } catch (err: any) {
      setApiError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Sign in failed');
    } finally {
      setLoadingAction(null);
      setLoading(false);
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

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          <ScrollView
            contentContainerClassName="grow px-container-mobile pt-8 pb-stack-lg justify-center"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Brand header */}
            <View className="items-center mb-8">
              <View className="w-[100px] h-[100px] rounded-full overflow-hidden mb-4 border border-neon-green/30">
                <Image
                  source={require('@/assets/images/icon.png')}
                  style={{ width: 100, height: 100 }}
                  contentFit="cover"
                />
              </View>
              <Text className="font-display text-[36px] font-extrabold text-neon-green tracking-[-0.72px] mb-1">
                G.I.F
              </Text>
              <Text className="font-body text-sm text-on-surface-variant opacity-70">
                Train Smarter. Adapt Automatically.
              </Text>
            </View>

            {/* Glass form card */}
            <View className="bg-[rgba(32,31,31,0.6)] border border-white/[0.07] rounded-xl p-6 gap-4">
              <Text className="font-display text-[22px] font-bold text-on-surface tracking-[-0.44px]">
                Welcome Back
              </Text>
              <Text className="font-body text-sm text-on-surface-variant -mt-2">
                Sign in to continue your journey
              </Text>

              {!!apiError && (
                <View className="bg-error-container/25 border border-error rounded-md py-2.5 px-3.5">
                  <Text className="font-body text-sm text-error text-center">{apiError}</Text>
                </View>
              )}

              <View className="gap-3">
                <View className="gap-1">
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Email address"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoCorrect={false}
                        editable={!isLoading}
                        isInvalid={!!errors.email}
                      />
                    )}
                  />
                  {errors.email && (
                    <Text className="font-body text-xs text-error ml-1">{errors.email.message}</Text>
                  )}
                </View>

                <View className="gap-1">
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        editable={!isLoading}
                        isInvalid={!!errors.password}
                      />
                    )}
                  />
                  {errors.password && (
                    <Text className="font-body text-xs text-error ml-1">{errors.password.message}</Text>
                  )}
                </View>
              </View>

              <Button onPress={handleSubmit(onSignIn)} disabled={isLoading}>
                {loadingAction === 'email' ? (
                  <ActivityIndicator size="small" color={GIFColors.onPrimary} />
                ) : (
                  'Sign In'
                )}
              </Button>

              <View className="flex-row items-center gap-3">
                <View className="flex-1 h-px bg-outline-variant" />
                <Text className="font-body text-xs text-on-surface-variant opacity-60">or</Text>
                <View className="flex-1 h-px bg-outline-variant" />
              </View>

              <Button onPress={onGooglePress} variant="outline" disabled={isLoading}>
                {loadingAction === 'google' ? (
                  <ActivityIndicator size="small" color={GIFColors.electricBlue} />
                ) : (
                  <View className="flex-row items-center gap-2.5">
                    <FontAwesome name="google" size={16} color={GIFColors.electricBlue} />
                    <Text className="font-body text-base font-semibold text-electric-blue">
                      Continue with Google
                    </Text>
                  </View>
                )}
              </Button>

              <Pressable
                onPress={() => router.push('/(auth)/sign-up')}
                disabled={isLoading}
                className="items-center pt-1"
              >
                <Text className="font-body text-sm text-on-surface-variant">
                  {"Don't have an account?"}{' '}
                  <Text className="text-electric-blue font-semibold">Sign up</Text>
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};
