import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClerk, useSignIn, useSSO } from "@clerk/expo";
import * as Linking from 'expo-linking';
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signIn } = useSignIn();
    const { setActive } = useClerk();
    const { startSSOFlow } = useSSO();

    const onGooglePress = async () => {
        setError('');
        try {
            const { createdSessionId, setActive: setSession } = await startSSOFlow({ strategy: 'oauth_google', redirectUrl: Linking.createURL('/'), });
            if (createdSessionId) await setSession!({ session: createdSessionId });
        } catch (err: any) {
            setError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Google sign-in failed');
        }
    };

    const onSignIn = async () => {
        setError('');
        const { error: signInError } = await signIn.create({ identifier: email, password });
        if (signInError) {
            setError(signInError?.longMessage ?? signInError?.message ?? 'Sign in failed');
            return;
        }
        if (signIn.status === 'complete') {
            await setActive({ session: signIn.createdSessionId });
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <SafeAreaView className="flex-1 justify-center items-center px-6">
                <ThemedView className="w-full max-w-[400] gap-4 p-6">
                    <ThemedText type="title" className="text-center">
                        Sign in
                    </ThemedText>
                    {!!error && <ThemedText className="text-[#FF3B30] text-center">{error}</ThemedText>}
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
                    <Button onPress={onSignIn}>Sign in</Button>
                    <ThemedText type="small" className="text-center">
                        or
                    </ThemedText>

                    <Button onPress={onGooglePress} variant="outline">Continue with Google</Button>

                    <Button onPress={() => router.push('/(auth)/sign-up')} variant="link">
                        <ThemedText type="small" className="text-center">
                            Do not have an account? Sign up
                        </ThemedText>
                    </Button>
                </ThemedView>
            </SafeAreaView>
        </ScrollView>
    );
}