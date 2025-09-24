import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { AppContext } from '../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HistoryScreen = () => {
    const { colors, history, loadHistory } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const styles = getStyles(colors);

    useFocusEffect(
        React.useCallback(() => {
            const fetchHistory = async () => {
                setLoading(true);
                await loadHistory();
                setLoading(false);
            };
            fetchHistory();
        }, [])
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Ionicons name="leaf" size={24} color={colors.primary} style={styles.icon} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                {/* Use the timestamp from the database */}
                <Text style={styles.itemDate}>{new Date(item.timestamp).toDateString()}</Text>
            </View>
            <Text style={styles.points}>+{item.ecoPoints} pts</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading History...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
             <Text style={styles.title}>Scan History</Text>
            {history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="archive-outline" size={60} color={colors.tabIcon} />
                    <Text style={styles.emptyText}>No scans yet.</Text>
                    <Text style={styles.emptySubText}>Your scanned items will appear here.</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
            )}
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
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
    },
    icon: { marginRight: 15 },
    itemDetails: { flex: 1 },
    itemName: { fontSize: 18, fontWeight: 'bold', color: colors.text },
    itemDate: { fontSize: 12, color: colors.primary, marginTop: 4 },
    points: { fontSize: 16, fontWeight: 'bold', color: colors.accent },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 20, color: colors.text, marginTop: 10, fontWeight: 'bold' },
    emptySubText: { fontSize: 14, color: colors.primary, marginTop: 5 },
});

export default HistoryScreen;