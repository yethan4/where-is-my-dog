import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons"

const FinalStep = () => {
  return (
    <View>
      <View className="bg-white px-4 py-4 rounded-xl items-center justify-center mb-4">
        <Ionicons name="document-text-outline" size={34} color="gray" />
        <Text className="text-gray-400 font-bold">Summary Preview</Text>
        <Text className="text-sm text-gray-400 font-semibold">Review all your data before submitting the listing</Text>
      </View>

      <Pressable className="items-center bg-green-600 rounded-2xl py-4">
        <Text className="text-white font-bold text-xl">Create Listing</Text>
      </Pressable>
    </View>
  )
}

export default FinalStep