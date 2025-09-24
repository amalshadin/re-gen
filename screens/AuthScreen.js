import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../api/supabase';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const AuthScreen = () => {
    const { colors } = useContext(AppContext);
    const styles = getStyles(colors);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // State for username
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) Alert.alert('Login Error', error.message);
        setLoading(false);
    }

    async function signUpWithEmail() {
        // Simple validation to ensure username is not empty for sign-up
        if (!username.trim()) {
            Alert.alert('Validation Error', 'Please enter a username.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (error) Alert.alert('Sign Up Error', error.message);
        else Alert.alert('Success', 'Please check your email to verify your account!');
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <Image source={require('../assets/icon-android.png')} style={styles.logo} />
            <Text style={styles.title}>Welcome to ReGen</Text>
            <Text style={styles.subtitle}>{isLogin ? 'Sign in to continue' : 'Create an account'}</Text>

            {/* 👇 The Username input is now correctly placed inside the return statement 👇 */}
            {!isLogin && (
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={24} color={colors.primary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor={colors.text}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>
            )}

            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={24} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={colors.text}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={colors.text}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
            ) : (
                <TouchableOpacity style={styles.button} onPress={isLogin ? signInWithEmail : signUpWithEmail}>
                    <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
                <Text style={styles.toggleText}>
                    {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.primary,
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 30,
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 15,
        elevation: 3,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: colors.text,
        fontSize: 16,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        elevation: 3,
    },
    buttonText: {
        color: colors.card,
        fontSize: 18,
        fontWeight: 'bold',
    },
    toggleButton: {
        marginTop: 25,
    },
    toggleText: {
        color: colors.text,
        fontSize: 14,
    },
});

export default AuthScreen;