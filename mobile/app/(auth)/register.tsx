import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

type FieldErrors = {
  username?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^(\+?[\d\s\-()]{7,15})$/

const validate = (
  username: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string,
): FieldErrors => {
  const errors: FieldErrors = {}

  if (!username) {
    errors.username = 'Username is required'
  } else if (username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username = 'Only letters, numbers and underscores allowed'
  }

  if (!email) {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  if (phone && !PHONE_REGEX.test(phone)) {
    errors.phone = 'Enter a valid phone number'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = 'Password must contain at least one letter and one number'
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { onRegister } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    const fieldErrors = validate(username, email, phone, password, confirmPassword)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true);
    const result = await onRegister({email, username, password, password2: confirmPassword, phone});
    setLoading(false);
    if (result.error) {
        setErrorMsg(result.msg);
        setPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
    } else {
        router.back();
    }
  }

  const borderClass = (field: keyof FieldErrors) =>
    errors[field] ? 'border-red-400' : 'border-gray-300'

    return (
    <KeyboardAvoidingView
        behavior='padding'
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={false}
        >
        <View className="flex-1 px-6 justify-center">
          <Pressable
            onPress={() => router.back()}
            className="absolute top-12 left-6 active:opacity-80"
          >
            <Ionicons name="arrow-back" size={28} color="#374151" />
          </Pressable>

          <Text className="text-3xl font-bold mb-8 text-center">Sign Up</Text>

          <View className="mb-4">
            <TextInput
              placeholder="Username"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={(v) => { setUsername(v); setErrors(e => ({ ...e, username: undefined })) }}
              autoCapitalize="none"
              className={`border ${borderClass('username')} rounded-lg p-4`}
            />
            {errors.username && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.username}</Text>}
          </View>

          <View className="mb-4">
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={(v) => { setEmail(v); setErrors(e => ({ ...e, email: undefined })) }}
              keyboardType="email-address"
              autoCapitalize="none"
              className={`border ${borderClass('email')} rounded-lg p-4`}
            />
            {errors.email && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email}</Text>}
          </View>

          <View className="mb-4">
            <TextInput
              placeholder="Phone Number (optional)"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={(v) => { setPhone(v); setErrors(e => ({ ...e, phone: undefined })) }}
              keyboardType="phone-pad"
              className={`border ${borderClass('phone')} rounded-lg p-4`}
            />
            {errors.phone && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</Text>}
          </View>

          <View className="mb-4">
            <View className={`border ${borderClass('password')} rounded-lg flex-row items-center`}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(v) => { setPassword(v); setErrors(e => ({ ...e, password: undefined })) }}
                secureTextEntry={!showPassword}
                className="flex-1 p-4"
              />
              <Pressable
                onPress={() => setShowPassword(v => !v)} className="pr-4 active:opacity-80"
              >
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
              </Pressable>
            </View>
            {errors.password && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password}</Text>}
          </View>

          <View className="mb-4">
            <View className={`border ${borderClass('confirmPassword')} rounded-lg flex-row items-center`}>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={(v) => { setConfirmPassword(v); setErrors(e => ({ ...e, confirmPassword: undefined })) }}
                secureTextEntry={!showConfirmPassword}
                className="flex-1 p-4"
              />
              <Pressable
                onPress={() => setShowConfirmPassword(v => !v)} className="pr-4 active:opacity-80"
              >
                <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
              </Pressable>
            </View>
            {errors.confirmPassword && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</Text>}
          </View>

          {errorMsg && (
            <View className="bg-red-100 rounded-lg p-4 mb-4">
              <Text className="text-red-700 font-bold text-center">{errorMsg}</Text>
            </View>
          )}

          <Pressable
            onPress={handleRegister}
            disabled={loading || !email || !username || !password || !confirmPassword}
            className={`bg-blue-600 py-4 rounded-lg mb-4 active:opacity-80 ${(!email || !username || !password || !confirmPassword || loading) ? 'opacity-60' : ''}`}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text className="text-white text-center font-semibold">Sign Up</Text>
            }
          </Pressable>

          <Pressable onPress={() => router.push('/(auth)/login')} className="active:opacity-80">
            <Text className="text-center text-blue-600 font-medium">
              Already have an account? Log in
            </Text>
          </Pressable>
        </View>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Register
