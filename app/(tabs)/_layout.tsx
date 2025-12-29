import { router, Tabs } from 'expo-router'
import { View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
const TabsLayout = () => {
  return (
    <Tabs>
      {/* <Tabs.Screen name='list' options={{ title: 'Create' }} /> */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Actuaciones',
          href: null,
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 26 },
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
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
          tabPress: e => {
            e.preventDefault()
            router.push('/(modal)/create')
          },
        }}
      />
    </Tabs>
  )
}
export default TabsLayout
