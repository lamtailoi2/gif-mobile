import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignUp, useSSO } from "@clerk/expo";
import * as Linking from 'expo-linking';
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const SignUp = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [error, setError] = useState('');
    const { signUp } = useSignUp();
    const { startSSOFlow } = useSSO();

    const onGooglePress = async () => {
        setError('');
        try {
            const { createdSessionId, setActive: setSession } = await startSSOFlow({ strategy: 'oauth_google', redirectUrl: Linking.createURL('/') });
            if (createdSessionId) await setSession!({ session: createdSessionId });
        } catch (err: any) {
            setError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Google sign-up failed');
        }
    };

    const onSignUp = async () => {
        setError('');
        const { error: createError } = await signUp.create({ emailAddress: email, password });
        if (createError) {
            setError((createError)?.longMessage ?? createError?.message ?? 'Sign up failed');
            return;
        }
        const { error: sendError } = await signUp.verifications.sendEmailCode();
        if (sendError) {
            setError((sendError)?.longMessage ?? sendError?.message ?? 'Could not send verification code');
            return;
        }
        setPendingVerification(true);
    };

    const onVerifyCode = async () => {
        setError('');
        const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
        if (verifyError) {
            setError((verifyError)?.longMessage ?? verifyError?.message ?? 'Verification failed');
            return;
        }
        const { error: finalizeError } = await signUp.finalize();
        if (finalizeError) {
            setError((finalizeError)?.longMessage ?? finalizeError?.message ?? 'Could not complete sign up');
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <SafeAreaView className="flex-1 justify-center items-center px-6">
                <ThemedView className="w-full max-w-[400] gap-4 p-6">
                    <ThemedText type="title" className="text-center">
                        {pendingVerification ? 'Check your email' : 'Sign up'}
                    </ThemedText>

                    {!!error && <ThemedText className="text-[#FF3B30] text-center">{error}</ThemedText>}

                    {pendingVerification ? (
                        <>
                            <ThemedText type="small" className="text-center">
                                Enter the verification code sent to {email}
                            </ThemedText>
                            <Input
                                placeholder="000 000"
                                value={code}
                                onChangeText={setCode}
                                keyboardType="number-pad"
                            />
                            <Button onPress={onVerifyCode}>Verify</Button>
                        </>
                    ) : (
                        <>
                            <Input
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            <Input
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />

                            <Button onPress={onSignUp}>Sign up</Button>

                            <ThemedText type="small" className="text-center">
                                or
                            </ThemedText>

                            <Button onPress={onGooglePress} variant="outline">Continue with Google</Button>

                            <Button onPress={() => router.push('/(auth)/sign-in')} variant="link">
                                <ThemedText type="small" className="text-center">
                                    Already have an account? Sign in
                                </ThemedText>
                            </Button>
                        </>
                    )}
                </ThemedView>
            </SafeAreaView>
        </ScrollView>
    );
}