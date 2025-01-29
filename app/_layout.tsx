import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const handleCaancel = () => {
    router.dismiss()
  }
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modal)/create" options={{
          headerShown: true,
          presentation: 'modal',
          title: 'Nueva actuación',
          sheetAllowedDetents: 'fitToContents',
          sheetInitialDetentIndex: 'last',
          headerLeft: () => (
            <Pressable onPress={handleCaancel}><Ionicons name="chevron-back-outline" size={20} /></Pressable>
          )
        }} />
      </Stack>
    </SafeAreaProvider>
  )
}
