import { Stack } from "expo-router";
import './global.css'
import { StatusBar } from "react-native";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen 
          name="(tabs)"
          options={{ headerShown:false }}
        />
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="listing/[id]"
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  )
}
