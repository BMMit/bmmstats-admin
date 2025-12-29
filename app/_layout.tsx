import ComposicionesProvider from '@/providers/composiciones-provider'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, Stack } from 'expo-router'
import { Pressable } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  const handleCaancel = () => {
    router.dismiss()
  }
  return (
    <SafeAreaProvider>
      <ComposicionesProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="detail/[id]"
            options={{
              headerShown: true,
              headerBackButtonDisplayMode: 'minimal',
            }}
          />
          <Stack.Screen
            name="(modal)/create"
            options={{
              headerShown: true,
              presentation: 'modal',
              title: 'Nueva actuación',
              sheetAllowedDetents: 'fitToContents',
              sheetInitialDetentIndex: 'last',
              headerLeft: () => (
                <Pressable onPress={handleCaancel}>
                  <Ionicons name="chevron-back-outline" size={20} />
                </Pressable>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/edit-interpretacion"
            options={{
              presentation: 'modal',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="(modal)/create-interpretacion"
            options={{
              presentation: 'modal',
              title: 'Nueva interpretación',
            }}
          />
        </Stack>
      </ComposicionesProvider>
    </SafeAreaProvider>
  )
}
