import { View, Text } from 'react-native'
import { Tabs } from 'expo-router'
import colors from "tailwindcss/colors";

import { MaterialIcons } from '@expo/vector-icons';

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: keyof typeof MaterialIcons.glyphMap; title: string }) => (
    <View className="flex-1 mt-3 flex flex-col items-center">
        <MaterialIcons name={icon} size={24} color={focused ? colors.stone['300'] : colors.stone['500']}/>

        <Text className={`${focused ? 'text-stone-300 font-dmsans-medium' : 'text-stone-500 font-dmsans'} text-xs w-full text-center mt-1`}>
            {title}
        </Text>
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
                    minHeight: 70,
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
        </Tabs>
    )
}

export default TabsLayout