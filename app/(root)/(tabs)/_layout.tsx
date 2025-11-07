// app/(root)/(tabs)/_layout.tsx
import { View, Text, Image } from 'react-native'
import { Tabs } from 'expo-router'

import icons from '@/constants/icons'

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: any; title: string }) => (
    <View className="flex-1 mt-3 flex flex-col items-center">
        <Image
            source={icon}
            style={{ tintColor: focused ? '#d6d3d1' : '#78716c', width: 24, height: 24 }}
            resizeMode="contain"
        />
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
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.home} title="Home" />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.search} title="Search" />,
                }}
            />
        </Tabs>
    )
}

export default TabsLayout
