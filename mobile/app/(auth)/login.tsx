import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login()
    router.back()
  };

  return (
    <View className="flex-1 px-6 justify-center">
      <Pressable 
        onPress={() => router.back()}
        className="absolute top-12 left-6"
      >
        <Ionicons name="arrow-back" size={28} color="#374151" />
      </Pressable>

      <Text className="text-3xl font-bold mb-8 text-center">Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#9CA3AF" 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="border border-gray-300 rounded-lg p-4 mb-4"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#9CA3AF" 
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 rounded-lg p-4 mb-6"
      />

      <Pressable
        onPress={handleLogin}
        className="bg-blue-600 py-4 rounded-lg mb-4"
      >
        <Text className="text-white text-center font-semibold">Login</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/(auth)/register')}>
        <Text className="text-center text-blue-600 font-medium">
          Don't have an account? Sign up
        </Text>
      </Pressable>

    </View>
  )
}

export default Login