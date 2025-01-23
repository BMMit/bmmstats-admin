import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import { Pressable, Text } from "react-native";

export default function RootLayout() {
  const handleCaancel = () => {
    router.dismiss()
  }
  return <Stack>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="(modal)/create" options={{
      headerShown: true,
      presentation: 'modal',
      title: 'Nueva actuación',
      headerLeft: () => (
        <Pressable onPress={handleCaancel}><Ionicons name="chevron-back-outline" size={20} /></Pressable>
      )
    }} />
  </Stack>
}
