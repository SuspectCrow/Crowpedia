import { View, Text } from 'react-native'
import { Tabs } from 'expo-router'
import colors from "tailwindcss/colors";

import { MaterialIcons } from '@expo/vector-icons';

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: keyof typeof MaterialIcons.glyphMap; title: string }) => (
    <View className="flex-1 flex flex-col items-center">
        <MaterialIcons name={icon} size={28} color={focused ? colors.stone['300'] : colors.stone['500']}/>
    </View>
)

const TabsLayout = () => {

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#44403c',
                    position: 'fixed',
                    borderTopColor: 'rgba(78,70,70,0.1)',
                    borderTopWidth: 1,
                    paddingTop: 6,
                    minHeight: 96,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="home" title="Home" />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="search" title="Search" />,
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendar',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="calendar-month" title="Calendar" />,
                }}
            />
        </Tabs>
    )
}

export default TabsLayout