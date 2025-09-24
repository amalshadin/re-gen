import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ScanScreen from '../screens/ScanScreen';
import HistoryScreen from '../screens/HistoryScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { lightTheme, darkTheme } from '../constants/Colors';

const Tab = createBottomTabNavigator();

const AppNavigator = ({ theme }) => {
    const colors = theme === 'dark' ? darkTheme : lightTheme;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Scan') {
                        iconName = focused ? 'scan-circle' : 'scan-circle-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'Leaderboard') {
                        iconName = focused ? 'trophy' : 'trophy-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.tabIconActive,
                tabBarInactiveTintColor: colors.tabIcon,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.background,
                },
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTitleStyle: {
                    color: colors.text,
                },
            })}
        >
            <Tab.Screen name="Scan" component={ScanScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default AppNavigator;