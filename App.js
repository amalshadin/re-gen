import React, { useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { AppProvider, AppContext } from './context/AppContext';
import { testGeminiConnection } from './api/gemini';
import AuthScreen from './screens/AuthScreen';

// This component now contains the main logic
const AppContent = () => {
    // Get both `session` and `theme` from the context
    const { session, theme } = useContext(AppContext);

    // This hook will run when the session state changes
    useEffect(() => {
        // We only test the Gemini connection if the user is successfully logged in
        if (session) {
            testGeminiConnection().catch(err => {
                console.error("Gemini connection test failed:", err);
                Alert.alert(
                    "Gemini Connection Failed",
                    "The app could not connect to the Gemini API. Please check project billing and API settings in Google Cloud."
                );
            });
        }
    }, [session]); // The effect depends on the session

    return (
        <NavigationContainer>
            {/*
              This is the core logic:
              - If a session exists, show the main AppNavigator.
              - Otherwise, show the AuthScreen for login/signup.
            */}
            {session && session.user ? <AppNavigator theme={theme} /> : <AuthScreen />}

            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        </NavigationContainer>
    );
};

// The main App function simply wraps everything in the AppProvider
export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}