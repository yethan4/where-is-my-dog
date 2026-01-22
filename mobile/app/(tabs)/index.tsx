import { View, Text, ScrollView, Pressable, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from "@expo/vector-icons";

const index = () => {
  const [listingType, setListingType] = useState<'found' | 'lost'>('lost');

  const listings = [
    {
      id: 1,
      type: 'lost',
      title: 'Small brown dog',
      description: 'Small brown dog, very friendly and playful.',
      dog_name: 'Pimpek',
      age_estimate: '2 years',
      breed: 'Beagle',
      size: 'small',
      color: 'brown',
      reward_offered: '50',
      photos: [
        { thumbnail_url: 'https://res.cloudinary.com/dnuvgzlhk/image/upload/v1766267970/listings/photos/t2ekgtylvxx0usg1vwuo.jpg' }
      ],
      primary_location: 'Lublin, Poland'
    },
    {
      id: 2,
      type: 'lost',
      title: 'Small brown dog',
      description: 'Small brown dog, very friendly and playful.',
      dog_name: 'Pimpek',
      age_estimate: '2 years',
      breed: 'Beagle',
      size: 'small',
      color: 'brown',
      reward_offered: '50',
      photos: [
        { thumbnail_url: 'https://res.cloudinary.com/dnuvgzlhk/image/upload/v1766267970/listings/photos/t2ekgtylvxx0usg1vwuo.jpg' }
      ],
      primary_location: 'Lublin, Poland'
    },
    {
      id: 3,
      type: 'lost',
      title: 'Small brown dog',
      description: 'Small brown dog, very friendly and playful.',
      dog_name: 'Pimpek',
      age_estimate: '2 years',
      breed: 'Beagle',
      size: 'small',
      color: 'brown',
      reward_offered: '50',
      photos: [
        { thumbnail_url: 'https://res.cloudinary.com/dnuvgzlhk/image/upload/v1766267970/listings/photos/t2ekgtylvxx0usg1vwuo.jpg' }
      ],
      primary_location: 'Lublin, Poland'
    },
  ]


  return (
    <View className="pt-safe px-4">
      {/* header */}
      <View className="flex flex-row items-center justify-between mb-4 mt-2">
        <Text className="text-3xl font-bold text-blue-800 ">Lublin</Text>
      </View>

      {/* buttons */}
      <View className="flex-row gap-2 mb-4 mx-auto">
        <Pressable 
          onPress={() => setListingType('lost')}
          className="pl-5 pr-2"
        >
          <Text className={`text-center text-2xl font-bold ${listingType === 'lost' ? 'text-gray-800' : 'text-gray-400'}`}>
            Lost
          </Text>
        </Pressable>
        <Pressable 
          onPress={() => setListingType('found')}
          className="pr-5 pl-2"
        >
          <Text className={`text-center text-2xl font-bold ${listingType === 'found' ? 'text-gray-800' : 'text-gray-400'}`}>
            Found
          </Text>
        </Pressable>
      </View>
      
      {/* listings */}
      <FlatList
        data={listings}
        renderItem={({item}) => (
          <View className="flex-row mb-2 p-4 rounded-lg border-b">
            {item.photos[0]?.thumbnail_url && (
              <Image 
                source={{ uri: item.photos[0].thumbnail_url }}
                className="w-40 h-40 rounded-lg mr-4"
              />
            )}
            <View className="flex-1">
              <Text className="text-xl font-bold mb-1">{item.title}</Text>
              <Text className="text-gray-700">{item.dog_name}</Text>
              <Text className="text-gray-600 text-sm">{item.description}</Text>
              <Text className="text-gray-500 text-sm mt-1">
                {item.age_estimate} • {item.size} • Reward: {item.reward_offered}$
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}

export default index