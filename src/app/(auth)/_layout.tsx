
import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
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
export default function AuthRoutesLayout() {
    useWarmUpBrowser();
    const { isSignedIn } = useAuth();

    if (isSignedIn) return <Redirect href="/" />;
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />
            <Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />
        </Stack>
    );
}