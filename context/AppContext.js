import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- This line is now correct
import { lightTheme, darkTheme } from '../constants/Colors';
import { supabase } from '../api/supabase';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [points, setPoints] = useState(0);
    const [history, setHistory] = useState([]);
    const [session, setSession] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session) {
            loadUserData();
            loadHistory();
        }
    }, [session]);

    const loadUserData = async () => {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) setTheme(savedTheme);

        const { data, error } = await supabase
            .from('profiles')
            .select('username, points')
            .eq('id', session.user.id)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error.message);
        } else if (data) {
            setUsername(data.username);
            setPoints(data.points);
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await AsyncStorage.setItem('theme', newTheme);
    };

    const addPoints = async (amount) => {
        const newPoints = points + amount;
        setPoints(newPoints);

        if (session && session.user) {
            const { error } = await supabase
                .from('profiles')
                .update({ points: newPoints, updated_at: new Date() })
                .eq('id', session.user.id);
            
            if (error) {
                console.error("Error updating points:", error.message);
            }
        }
    };

    const addScanToHistory = async (scanResult) => {
        const newHistoryItem = {
            user_id: session.user.id,
            item_name: scanResult.itemName,
            eco_points: scanResult.ecoPoints,
            scan_data: scanResult,
        };
        const { error } = await supabase.from('scan_history').insert(newHistoryItem);
        if (error) {
            console.error('Error saving scan history:', error.message);
            return;
        }
        const displayItem = { ...scanResult, created_at: new Date().toISOString() };
        setHistory(prevHistory => [displayItem, ...prevHistory]);
    };

    const loadHistory = async () => {
        if (!session || !session.user) return;
        const { data, error } = await supabase
            .from('scan_history')
            .select('id, created_at, item_name, eco_points, scan_data')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching history:', error.message);
        } else {
            const formattedHistory = data.map(item => ({
                id: item.id.toString(),
                timestamp: item.created_at,
                itemName: item.item_name,
                ecoPoints: item.eco_points,
                ...item.scan_data
            }));
            setHistory(formattedHistory);
        }
    };

    const colors = theme === 'dark' ? darkTheme : lightTheme;

    const contextValue = {
        theme,
        colors,
        toggleTheme,
        points,
        addPoints,
        history,
        addScanToHistory,
        loadHistory,
        session,
        username,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};