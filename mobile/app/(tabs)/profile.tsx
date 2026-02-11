import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { authState, onLogout } = useAuth();
  const router = useRouter();
  const currentUser = authState.user


  if (!authState.isAuthenticated) {
    return (
      <View className="pt-safe px-4 flex-1 justify-center items-center">
        <Text className="text-2xl font-bold mb-8">Welcome!</Text>
        <View className="gap-4 w-full px-8">
          <Pressable 
            onPress={() => router.push("/(auth)/login")}
            className="bg-blue-600 py-4 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Login</Text>
          </Pressable>
          <Pressable 
            onPress={() => router.push("/(auth)/register")}
            className="border-2 border-blue-600 py-4 rounded-lg"
          >
            <Text className="text-blue-600 text-center font-semibold">Register</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View className="pt-safe px-4">
      <Text className="text-2xl font-bold mb-4">Profile</Text>
      <Text className="text-xl font-bold mt-0">
        username:{currentUser?.username} email:{currentUser?.email}
      </Text>
      <Text className="mb-8">You are logged in!</Text>
      
      <Pressable 
        onPress={onLogout}
        className="bg-red-500 py-4 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Logout</Text>
      </Pressable>
    </View>
  )
}

export default Profile