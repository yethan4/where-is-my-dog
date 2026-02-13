import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type ListingType = 'lost' | 'found'
type ListingStatus = 'active' | 'expired' | 'found' | 'returned'


export interface ListingCardItem {
    id: number;
    type: ListingType;
    status: ListingStatus;
    title: string;
    reward_offered: string | null;
    primary_photo: string | null,
    dog_name: string | null,
    primary_location: string | null,
    description: string,
    breed: string | null,
    age_estimate: string | null,
    color: string | null,
    has_collar: boolean,
    collar_color: string,
    created_at: string,
}


const ListingCard = ({ item }: {item: ListingCardItem}) => {
    const router = useRouter()

  return (
    <Pressable 
    	className="bg-white min-h-64 rounded-2xl mb-4 pb-2 shadow-sm border border-gray-100 overflow-hidden active:backdrop-opacity-95"
		onPress={() => {
			router.push(`/listing/${item.id}`)
		}}
	>
        <View className="items-center flex-row pt-3 pb-1 px-4">
            <Text 
            className="flex-1 text-xl font-bold"
            numberOfLines={2}
            ellipsizeMode="tail"
            >
            {item.title}
            </Text>
            {!!item.reward_offered && <View className="items-start h-full ml-1">
            <Text className="py-1 px-2 rounded-full bg-green-50 text-green-700 font-bold text-sm">
                {item.reward_offered} PLN
            </Text>
            </View>}
        </View>
        <View className="flex-row pt-2 px-2">
            <View>
            <View className="relative mb-2">
                {!!item.primary_photo ? (
                <Image 
                    source={{ uri: item.primary_photo }}
                    className="w-40 h-40 rounded-lg mr-4"
                />
                ) : (
                <Image 
                    source={require('../assets/images/dog-placeholder.png')}
                    className="w-40 h-40 rounded-lg mr-4"
                /> 
                )}
                {!!item?.dog_name && 
                <View className="absolute top-36 left-0 right-2 items-center">
                <View className="px-3 py-1 bg-red-500 rounded-xl">
                    <Text className="text-slate-50 text-sm font-semibold tracking-wider">
                    {item.dog_name}
                    </Text>
                </View>
                </View>
                }
            </View>

            <View className="flex-row flex-1 items-center w-36 mt-2">
                <Ionicons name="location-sharp" size={14} color="#64748b" />
                <Text className="text-slate-600 text-xs font-medium tracking-wide ml-1">
                {item.primary_location}
                </Text>
            </View>

            </View>
            <View className="flex-1 relative">
            <Text 
                className="text-slate-600 text-sm"
                numberOfLines={4}
            >
                {item.description}
            </Text>
            
            <View className="flex-row flex-wrap gap-2 mt-2">
                {/* breed */}
                <View className="flex-row items-center bg-blue-50 px-2.5 py-1.5 rounded-full border border-blue-100">
                <FontAwesome5 name="dog" size={14} color="#3b82f6" />
                <Text className="text-blue-700 text-xs font-semibold ml-1.5">{item.breed}</Text>
                </View>

                {/* age */}
                {!!item.age_estimate && (
                    <View className="flex-row items-center bg-gray-100 px-2.5 py-1.5 rounded-full">
                        <MaterialCommunityIcons name="clock-outline" size={16} color="#4b5563" />
                        <Text className="text-gray-700 text-xs font-semibold ml-1">{item.age_estimate}</Text>
                    </View>
                )}

                {/* color */}
                <View className="flex-row items-center bg-gray-100 px-2.5 py-1.5 rounded-full">
                <Ionicons name="color-palette-outline" size={16} color="#4b5563" />
                <Text className="text-gray-700 text-xs font-semibold ml-1">{item.color}</Text>
                </View>

                {/* collar */}
                <View className={`flex-row items-center px-2.5 py-1.5 rounded-full ${item.has_collar ? 'bg-gray-100 border border-green-100' : 'bg-gray-100 border border-red-100'}`}>
                <MaterialCommunityIcons 
                    name={item.has_collar ? "link-variant" : "link-variant-off"} 
                    size={16} 
                    color={item.has_collar ? "#16a34a" : "#dc2626"} 
                />
                <Text className={`text-xs font-semibold ml-1 ${item.has_collar ? 'text-slate-900' : 'text-red-700'}`}>
                    {item.has_collar ? `Collar: ${item.collar_color}` : "No collar"}
                </Text>
                </View>
            </View>

            </View>
        </View>
    </Pressable>
  )
}

export default ListingCard