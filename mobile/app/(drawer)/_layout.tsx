import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import { useTheme } from '@/context/ThemeContext';

export default function DrawerLayout() {
    const { colors, isDark } = useTheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerShown: true, // Show header by default for screens to get the Hamburger button
                    headerTintColor: colors.text,
                    headerStyle: {
                        backgroundColor: colors.card,
                    },
                    drawerStyle: {
                        backgroundColor: colors.card,
                        width: 280,
                    },
                    drawerType: 'front',
                    overlayColor: 'rgba(0,0,0,0.5)',
                }}
            >
                <Drawer.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false, // Tabs has its own header
                        drawerLabel: 'Home',
                    }}
                />
                {/* 
                  We don't need to explicitly list every screen if they are just files in this dir, 
                  but we can to configure them.
                  However, with expo-router/drawer, files in the directory are automatically screens.
                  We want (tabs) to be the default.
                */}
            </Drawer>
        </GestureHandlerRootView>
    );
}
