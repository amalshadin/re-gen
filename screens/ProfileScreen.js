import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { AppContext } from '../context/AppContext';
import { getDailyChallenge } from '../api/gemini';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../api/supabase';

const badges = [
    { name: 'Seedling', icon: 'seedling', threshold: 50 },
    { name: 'Eco-Novice', icon: 'leaf', threshold: 100 },
    { name: 'Recycling Pro', icon: 'recycle', threshold: 250 },
    { name: 'Eco-Warrior', icon: 'shield-alt', threshold: 500 },
    { name: 'Planet Guardian', icon: 'globe-americas', threshold: 1000 },
];

const ProfileScreen = () => {
    // 1. Get `username` from the context
    const { theme, colors, toggleTheme, points, username } = useContext(AppContext);
    const [challenge, setChallenge] = useState({ challenge: '', tip: '' });

    useEffect(() => {
        const fetchChallenge = async () => {
            const dailyChallenge = await getDailyChallenge();
            setChallenge(dailyChallenge);
        };
        fetchChallenge();
    }, []);

    const unlockedBadges = badges.filter(badge => points >= badge.threshold);
    const styles = getStyles(colors);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="person-circle" size={80} color={colors.primary} />
                
                {/* 2. Display the dynamic username */}
                <Text style={styles.username}>{username || 'Eco User'}</Text>
                
                <View style={styles.pointsContainer}>
                    <Ionicons name="leaf" size={24} color={colors.accent} />
                    <Text style={styles.pointsText}>{points} Eco-Points</Text>
                </View>
            </View>

            {/* Daily Challenge Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Daily Eco-Challenge</Text>
                <Text style={styles.challengeText}>{challenge.challenge}</Text>
                <Text style={styles.challengeTip}>{challenge.tip}</Text>
            </View>

            {/* Badges Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>My Badges</Text>
                <View style={styles.badgesContainer}>
                    {unlockedBadges.length > 0 ? unlockedBadges.map(badge => (
                        <View key={badge.name} style={styles.badge}>
                            <FontAwesome5 name={badge.icon} size={30} color={colors.primary} />
                            <Text style={styles.badgeText}>{badge.name}</Text>
                        </View>
                    )) : <Text style={styles.noBadgesText}>Scan items to unlock badges!</Text>}
                </View>
            </View>

            {/* Settings Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Settings</Text>
                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Dark Mode</Text>
                    <Switch
                        value={theme === 'dark'}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: colors.accent }}
                        thumbColor={theme === 'dark' ? colors.primary : '#f4f3f4'}
                    />
                </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => supabase.auth.signOut()}
            >
                <Ionicons name="log-out-outline" size={24} color={'#E74C3C'} />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

// --- STYLES (No changes needed here) ---
const getStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, },
    header: { alignItems: 'center', padding: 30 },
    username: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginTop: 10 },
    pointsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: colors.card, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, elevation: 2 },
    pointsText: { fontSize: 18, color: colors.accent, fontWeight: 'bold', marginLeft: 8 },
    card: { backgroundColor: colors.card, borderRadius: 15, padding: 20, marginHorizontal: 20, marginBottom: 20, elevation: 3 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 15 },
    challengeText: { fontSize: 16, color: colors.text, fontStyle: 'italic', marginBottom: 5 },
    challengeTip: { fontSize: 14, color: colors.primary },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    settingText: { fontSize: 16, color: colors.text },
    badgesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
    badge: { alignItems: 'center', margin: 10, width: 80 },
    badgeText: { fontSize: 12, color: colors.text, marginTop: 5, textAlign: 'center' },
    noBadgesText: { color: colors.primary, fontSize: 14 },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.card,
        paddingVertical: 15,
        borderRadius: 30,
        marginHorizontal: 20,
        marginBottom: 40,
        marginTop: 5,
        borderWidth: 1.5,
        borderColor: '#E74C3C',
        elevation: 3,
    },
    logoutButtonText: {
        color: '#E74C3C',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default ProfileScreen;