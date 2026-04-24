import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import ProfileScreen from "@/components/ProfileScreen";

const Profile = () => {
  const { authState, onLogout } = useAuth();
  const router = useRouter();

  if (authState.isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    )
  }

  if (!authState.isAuthenticated) {
    return (
      <View className="pt-safe px-4 flex-1 justify-center items-center">
        <Text className="text-2xl font-bold mb-8">Welcome!</Text>
        <View className="gap-4 w-full px-8">
          <Pressable
            onPress={() => router.push("/(auth)/login")}
            className="bg-blue-600 py-4 rounded-lg active:opacity-80"
          >
            <Text className="text-white text-center font-semibold">Login</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(auth)/register")}
            className="border-2 border-blue-600 py-4 rounded-lg active:opacity-80"
          >
            <Text className="text-blue-600 text-center font-semibold">Register</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return <ProfileScreen user={authState.user!} onLogout={onLogout} />
}

export default Profile