import { View, Text, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    login()
    router.back()
  }

    return (
    <View className="flex-1 px-6 justify-center">
      <Pressable 
        onPress={() => router.back()}
        className="absolute top-12 left-6"
      >
        <Ionicons name="arrow-back" size={28} color="#374151" />
      </Pressable>

      <Text className="text-3xl font-bold mb-8 text-center">Sign Up</Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor="#9CA3AF"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        className="border border-gray-300 rounded-lg p-4 mb-4"
      />

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
        placeholder="Phone Number"
        placeholderTextColor="#9CA3AF"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        className="border border-gray-300 rounded-lg p-4 mb-4"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 rounded-lg p-4 mb-4"
      />

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#9CA3AF"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        className="border border-gray-300 rounded-lg p-4 mb-6"
      />

      <Pressable
        onPress={handleRegister}
        className="bg-blue-600 py-4 rounded-lg mb-4"
      >
        <Text className="text-white text-center font-semibold">Sign Up</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/(auth)/login')}>
        <Text className="text-center text-blue-600 font-medium">
          Already have an account? Log in
        </Text>
      </Pressable>
    </View>
  )
}

export default Register