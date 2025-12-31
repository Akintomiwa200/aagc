import { Tabs } from 'expo-router';
import { Home, Calendar, BookOpen, Heart, User } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
    const { theme } = useTheme();

    const isDark = theme === 'dark';
    const activeColor = '#7C3AED'; // primary-600
    const inactiveColor = isDark ? '#9CA3AF' : '#6B7280';
    const backgroundColor = isDark ? '#000000' : '#FFFFFF';

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: inactiveColor,
                tabBarStyle: {
                    backgroundColor,
                    borderTopColor: isDark ? '#1F2937' : '#E5E7EB',
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
                headerShown: true,
                headerStyle: {
                    backgroundColor,
                },
                headerTintColor: isDark ? '#FFFFFF' : '#111827',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                    headerTitle: 'Apostolic Army Global',
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: 'Events',
                    tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="devotional"
                options={{
                    title: 'Devotional',
                    tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="prayers"
                options={{
                    title: 'Prayers',
                    tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
