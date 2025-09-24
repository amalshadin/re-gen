import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { AppContext } from '../context/AppContext';
import { supabase } from '../api/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const LeaderboardScreen = () => {
    const { colors, session } = useContext(AppContext);
    const styles = getStyles(colors);

    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, points')
            .order('points', { ascending: false })
            .limit(50); // Fetch top 50 users

        if (error) {
            console.error('Error fetching leaderboard:', error);
        } else {
            const rankedData = data.map((item, index) => ({ ...item, rank: index + 1 }));
            setLeaderboardData(rankedData);
        }
        setLoading(false);
    };
    
    // This hook re-fetches data every time the screen comes into view
    useFocusEffect(
        React.useCallback(() => {
            fetchLeaderboard();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading Leaderboard...</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => {
        const isCurrentUser = item.id === session?.user?.id;

        return (
            <View style={[styles.card, isCurrentUser && styles.userCard]}>
                <Text style={[styles.rank, isCurrentUser && styles.userCardText]}>{item.rank}</Text>
                <Ionicons name="person-circle" size={40} color={isCurrentUser ? colors.card : colors.primary} style={styles.icon} />
                <Text style={[styles.name, isCurrentUser && styles.userCardText]}>
                    {isCurrentUser ? 'You' : item.username}
                </Text>
                <Text style={[styles.points, isCurrentUser && { color: colors.card }]}>{item.points} pts</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Top Performers</Text>
            <FlatList
                data={leaderboardData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const getStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    loadingText: { marginTop: 10, color: colors.text, fontSize: 16 },
    title: { fontSize: 28, fontWeight: 'bold', color: colors.text, textAlign: 'center', paddingVertical: 20 },
    list: { paddingHorizontal: 20, paddingBottom: 20 },
    card: {
        backgroundColor: colors.card,
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
    },
    userCard: {
        backgroundColor: colors.primary,
        borderColor: colors.accent,
        borderWidth: 2,
    },
    userCardText: {
        color: colors.card,
    },
    rank: { fontSize: 18, fontWeight: 'bold', color: colors.text, width: 40 },
    icon: { marginHorizontal: 10 },
    name: { flex: 1, fontSize: 18, fontWeight: 'bold', color: colors.text },
    points: { fontSize: 16, fontWeight: 'bold', color: colors.accent },
});

export default LeaderboardScreen;