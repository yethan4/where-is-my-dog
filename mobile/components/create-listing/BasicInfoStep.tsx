import { View, Text, ScrollView, Pressable, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons"
import { ListingCreate, ListingType } from "@/types/listing";

type Props = {
  onChange: (data: Partial<ListingCreate>) => void;
  initialData?: Partial<ListingCreate>;
  setCanContinue: (flag: boolean) => void;
}

const BasicInfoStep = ({onChange, initialData, setCanContinue}: Props) => {
  const [listingType, setListingType] = useState<ListingType | undefined>(initialData?.type);
  const [title, setTitle] = useState<string>(initialData?.title ?? "");
  const [description, setDescription] = useState<string>(initialData?.description ?? "");

  const isValid = (): boolean => {
    return title.trim().length > 0 && description.trim().length > 0;
  };

  useEffect(() => {
    onChange({ type: listingType, title, description})
    isValid() ? setCanContinue(true) : setCanContinue(false);
  }, [listingType, title, description])

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 400 }}
    >
      <View className="px-2">

        <Text className="uppercase tracking-wide text-sm mb-4 font-semibold">What happend?</Text>
        <View className="flex-row w-full px-4 items-center justify-center mb-6">
          <Pressable 
            className={`items-center justify-center px-8 py-6 border-2  rounded-lg mr-2 ${listingType==="lost" ? 'border-gray-500' : 'border-gray-200'}`}
            onPress={() => setListingType("lost")}
          >
            <FontAwesome6 name="dog" size={32} color="#b05a13" className="mb-2" />
            <Text className={`font-bold mt-2 text-lg mb-1 ${listingType==="lost" ? 'text-gray-600' : 'text-gray-400'}`}>Lost Dog</Text>
            <Text className={`text-xs text-center font-semibold ${listingType==="lost" ? 'text-gray-600' : 'text-gray-400'}`}>My dog went missing</Text>
          </Pressable>

          <Pressable 
            className={`items-center justify-center px-8 py-6 border-2  rounded-lg mr-2 ${listingType==="found" ? 'border-gray-500' : 'border-gray-200'}`}
            onPress={() => setListingType("found")}
          >
            <FontAwesome5 name="paw" size={32} color="#631e19" className="mb-2"  />
            <Text className={`font-bold mt-2 text-lg mb-1 ${listingType==="found" ? 'text-gray-600' : 'text-gray-400'}`}>Found Dog</Text>
            <Text className={`text-xs text-center font-semibold ${listingType==="found" ? 'text-gray-600' : 'text-gray-400'}`}>I found a stray dog</Text>
          </Pressable>
        </View>


        <View className="relative mb-6">
          <Text className="uppercase tracking-wide text-sm mb-4 font-semibold">Listing title</Text>

          <Text className="absolute right-2 top-3 text-xs text-gray-500">{title.length}/200</Text>

          <TextInput 
            placeholder="e.g. Missing bulldog - Czuby"
            placeholderTextColor="#9CA3AF" 
            className="border-2 border-gray-200 rounded-xl py-4 px-4 font-semibold"
            value={title}
            onChangeText={setTitle}
            maxLength={200}
          />
          
        </View>

        <View className="relative">
          <Text className="uppercase tracking-wide text-sm mb-4 font-semibold">Description</Text>

          <Text className="absolute right-2 top-3 text-xs text-gray-500">{description.length}</Text>

          <TextInput 
            placeholder="Describe when and where your dog disappeared, any special marks, behavior..."
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF" 
            className="border-2 border-gray-200 rounded-xl py-4 px-4 font-semibold min-h-48"
            value={description}
            onChangeText={setDescription}
          />
          
        </View>

      </View>
    </ScrollView>
  )
}

export default BasicInfoStep