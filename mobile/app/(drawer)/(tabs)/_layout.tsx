import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Home, Calendar, BookOpen, Heart, User, Menu } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation();

    const activeColor = colors.primary;
    const inactiveColor = colors.secondary;
    const backgroundColor = colors.card;

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
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        style={{ marginLeft: 16 }}
                    >
                        <Menu color={isDark ? '#FFFFFF' : '#111827'} size={24} />
                    </TouchableOpacity>
                ),
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
