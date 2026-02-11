import { View, Text, ScrollView, Pressable, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import ListingCard, { ListingItem } from "@/components/ListingCard";
import axios from "axios";

interface ListingsResponse {
  results: ListingItem[];
}

const index = () => {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [listingType, setListingType] = useState<'found' | 'lost'>('lost');
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const fetchListings = async() => {
    try {
      setLoading(true);
      const response = await axios.get<ListingsResponse>(`${API_URL}/api/listings/`, {
        params: {
          type: listingType,
          status: 'active',
        }
      });
      setListings(response.data.results);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchListings();
  }, [listingType]);


  return (
    <View className="pt-safe px-4">
      {/* header */}
      <View className="px-3 pt-4 pb-2 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 text-sm font-medium uppercase tracking-wider">Location</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location" size={24} color="#2563EB" />
            <Text className="text-3xl font-bold tracking-wide">Lublin</Text>
          </View>
        </View>

        <View className="bg-white rounded-full p-2">
          <Ionicons name="notifications-outline" size={24} className="" />
        </View>
      </View>

      {/* Toggle between Lost and Found listings */}
      <View className="mt-2 mb-4 py-1 px-1 h-14 w-full flex-row rounded-2xl justify-center bg-gray-200">
        <Pressable
          onPress={() => setListingType('lost')}
          className={`flex-1 justify-center items-center rounded-xl ${listingType === 'lost' ? ' bg-slate-50': 'bg-transparent'}`}
        >
          <Text className={`font-bold text-2xl ${listingType === 'lost' ? 'text-red-600' : 'text-gray-700'}`}>
            Lost
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setListingType('found')}
          className={`flex-1 justify-center items-center rounded-xl ${listingType === 'found' ? ' bg-slate-50': 'bg-transparent'}`}
        >
          <Text className={`font-bold text-2xl ${listingType === 'found' ? 'text-red-600' : 'text-gray-700'}`}>
            Found
          </Text>
        </Pressable>
      </View>
      
      {/* listings */}
      <FlatList
        data={listings}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
        renderItem={({item}) => (
          <ListingCard item={item} />
        )}
      />
    </View>
  )
}

export default index