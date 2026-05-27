
import { AuthLoadingOverlay } from '@/components/auth-loading-overlay';
import { AuthLoadingProvider, useAuthLoading } from '@/context/auth-loading-context';
import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

export const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};
WebBrowser.maybeCompleteAuthSession();

function AuthLayoutInner() {
    useWarmUpBrowser();
    const { isSignedIn } = useAuth();
    const { isLoading } = useAuthLoading();

    if (isSignedIn) return <Redirect href="/" />;
    return (
        <View className="flex-1">
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />
                <Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />
            </Stack>
            {isLoading && <AuthLoadingOverlay />}
        </View>
    );
}

export default function AuthRoutesLayout() {
    return (
        <AuthLoadingProvider>
            <AuthLayoutInner />
        </AuthLoadingProvider>
    );
}