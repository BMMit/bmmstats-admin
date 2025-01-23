import { router, Stack, Tabs } from 'expo-router'
import { View, Text, Pressable } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
const TabsLayout = () => {
  return (
    <Tabs >
      <Tabs.Screen name='list' options={{ title: 'Create', href: null }} />
      <Tabs.Screen name='index' options={{ title: '', href: null }} />
      <Tabs.Screen name='create' options={{
        title: 'Create',
        tabBarIcon: () => (
          <View>
            <Ionicons name="add-circle" size={30} color="black" />
          </View>
        ),
        tabBarLabel: '',
        tabBarBadgeStyle: { opacity: 0, color: '' },
      }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault()
            router.push('/(modal)/create')
          }
        }}
      />
    </Tabs>
  )
}
export default TabsLayout