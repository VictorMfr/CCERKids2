import colors from '@/constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: colors.secondary, animation: 'shift', headerStyle: { backgroundColor: colors.primary }, headerTintColor: 'white' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color }) => <FontAwesome size={20} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Notificaciones',
                    tabBarIcon: ({ color }) => <FontAwesome size={20} name="bell" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ color }) => <FontAwesome size={20} name="gear" color={color} />,
                }}
            />
            <Tabs.Screen
                name="useDashboardController"
                options={{
                    href: null
                }}
            />
            
        </Tabs>
    );
}
