import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GIFColors } from '@/constants/theme';
import { useAuthLoading } from '@/context/auth-loading-context';
import { useClerk, useSignUp, useSSO } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { SignUpForm, signUpSchema } from '../libs/schema';



function GoogleIcon({ size = 20 }: { size?: number }) {
  const r = size / 2;
  return (
    <View style={{ width: size, height: size, borderRadius: r, overflow: 'hidden', backgroundColor: '#fff' }}>
      <View style={{ position: 'absolute', top: 0, left: 0, width: r, height: r, backgroundColor: '#4285F4' }} />
      <View style={{ position: 'absolute', top: 0, right: 0, width: r, height: r, backgroundColor: '#EA4335' }} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, width: r, height: r, backgroundColor: '#FBBC05' }} />
      <View style={{ position: 'absolute', bottom: 0, right: 0, width: r, height: r, backgroundColor: '#34A853' }} />
      <View style={{ position: 'absolute', top: size * 0.2, left: size * 0.2, width: size * 0.6, height: size * 0.6, borderRadius: size * 0.3, backgroundColor: '#fff' }} />
      <View style={{ position: 'absolute', top: size * 0.4, left: size * 0.5, width: size * 0.3, height: size * 0.2, backgroundColor: '#4285F4' }} />
    </View>
  );
}

export const SignUp = () => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loadingAction, setLoadingAction] = useState<'signUp' | 'verify' | 'google' | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState('');

  const { isLoading, setLoading } = useAuthLoading();
  const { signUp } = useSignUp();
  const { setActive } = useClerk();
  const { startSSOFlow } = useSSO();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onGooglePress = async () => {
    if (isLoading) return;
    setApiError('');
    setLoadingAction('google');
    setLoading(true);
    try {
      const { createdSessionId } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: Linking.createURL('/'),
      });
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      setApiError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Google sign-up failed');
    } finally {
      setLoadingAction(null);
      setLoading(false);
    }
  };

  const onSignUp = async (data: SignUpForm) => {
    if (!signUp || isLoading) return;
    setApiError('');
    setLoadingAction('signUp');
    setLoading(true);
    try {
      const { error: createError } = await signUp.create({ emailAddress: data.email, password: data.password });
      if (createError) {
        setApiError(createError.longMessage ?? createError.message ?? 'Sign up failed');
        return;
      }
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setApiError(sendError.longMessage ?? sendError.message ?? 'Could not send verification code');
        return;
      }
      setVerifiedEmail(data.email);
      setPendingVerification(true);
    } catch (err: any) {
      setApiError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Sign up failed');
    } finally {
      setLoadingAction(null);
      setLoading(false);
    }
  };

  const onVerifyCode = async () => {
    if (!signUp || isLoading) return;
    setApiError('');
    setLoadingAction('verify');
    setLoading(true);
    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
      if (verifyError) {
        setApiError(verifyError.longMessage ?? verifyError.message ?? 'Verification failed');
        return;
      }
      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setApiError(finalizeError.longMessage ?? finalizeError.message ?? 'Could not complete sign up');
        return;
      }
    } catch (err: any) {
      setApiError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Verification failed');
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
            'radial-gradient(circle at 50% 0%, rgba(75,142,255,0.08) 0%, rgba(19,19,19,1) 65%)',
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
              <View className="w-[100px] h-[100px] rounded-full overflow-hidden mb-4 border border-electric-blue/30">
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
              {pendingVerification ? (
                <>
                  {/* Verification state */}
                  <View className="items-center gap-2">
                    <View className="w-14 h-14 rounded-full bg-electric-blue/15 border border-electric-blue/30 items-center justify-center mb-1">
                      <Text className="font-display text-2xl font-bold text-electric-blue">@</Text>
                    </View>
                    <Text className="font-display text-[22px] font-bold text-on-surface tracking-[-0.44px]">
                      Check your email
                    </Text>
                    <Text className="font-body text-sm text-on-surface-variant -mt-2 leading-5 text-center">
                      Enter the 6-digit code sent to{'\n'}
                      <Text className="text-neon-green font-semibold">{verifiedEmail}</Text>
                    </Text>
                  </View>

                  {!!apiError && (
                    <View className="bg-error-container/25 border border-error rounded-md py-2.5 px-3.5">
                      <Text className="font-body text-sm text-error text-center">{apiError}</Text>
                    </View>
                  )}

                  <Input
                    placeholder="000 000"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    style={{
                      textAlign: 'center',
                      fontSize: 24,
                      fontWeight: '700',
                      letterSpacing: 8,
                      fontFamily: 'JetBrains Mono',
                    }}
                    editable={!isLoading}
                  />

                  <Button onPress={onVerifyCode} disabled={isLoading}>
                    {loadingAction === 'verify' ? (
                      <ActivityIndicator size="small" color={GIFColors.onPrimary} />
                    ) : (
                      'Verify & Continue'
                    )}
                  </Button>

                  <Pressable
                    onPress={() => setPendingVerification(false)}
                    disabled={isLoading}
                    className="items-center pt-1"
                  >
                    <Text className="font-body text-sm text-on-surface-variant">
                      {'← '}
                      <Text className="text-electric-blue font-semibold">Go back</Text>
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  {/* Registration state */}
                  <Text className="font-display text-[22px] font-bold text-on-surface tracking-[-0.44px]">
                    Create account
                  </Text>
                  <Text className="font-body text-sm text-on-surface-variant -mt-2">
                    Start your performance journey
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

                    <View className="gap-1">
                      <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            placeholder="Confirm Password"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            secureTextEntry
                            editable={!isLoading}
                            isInvalid={!!errors.confirmPassword}
                          />
                        )}
                      />
                      {errors.confirmPassword && (
                        <Text className="font-body text-xs text-error ml-1">{errors.confirmPassword.message}</Text>
                      )}
                    </View>
                  </View>

                  <Button onPress={handleSubmit(onSignUp)} disabled={isLoading}>
                    {loadingAction === 'signUp' ? (
                      <ActivityIndicator size="small" color={GIFColors.onPrimary} />
                    ) : (
                      'Create Account'
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
                        <GoogleIcon size={20} />
                        <Text className="font-body text-base font-semibold text-electric-blue">
                          Continue with Google
                        </Text>
                      </View>
                    )}
                  </Button>

                  <Pressable
                    onPress={() => router.push('/(auth)/sign-in')}
                    disabled={isLoading}
                    className="items-center pt-1"
                  >
                    <Text className="font-body text-sm text-on-surface-variant">
                      {'Already have an account? '}
                      <Text className="text-electric-blue font-semibold">Sign in</Text>
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};
