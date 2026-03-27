import { View, Text, Pressable, Switch, TextInput, Keyboard, Image, ScrollView, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons"
import ListingCard from "../ListingCard"
import { ListingCreate } from "@/types/listing"
import { LocationState } from "@/app/(tabs)/create"
import MapView, { Circle, Marker } from "react-native-maps"
import { useAuth } from "@/contexts/AuthContext"
import axios from 'axios';
import { useRouter } from "expo-router"

type Props = {
  listingData: ListingCreate;
  photos: string[];
  location: LocationState;
  resetForm: () => void;
}

const FinalStep = ({listingData, photos, location, resetForm}: Props) => {
  const [rewardActive, setRewardActive] = useState<boolean>(false);
  const [reward, setReward] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [newListingId, setNewListingId] = useState<number | null>(null);

  const { authState } = useAuth();
  const router = useRouter();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const toggleReward = (value: boolean) => {
    setRewardActive(value);
    if (!value) {
      setReward("0");
      setIsConfirmed(false);
    }
  };

  const handleConfirm = () => {
    if (reward.length > 0) {
      setIsConfirmed(true);
      Keyboard.dismiss();
    }
  };

  const handleCreateListing = async () => {
    setError('');
    try {
      setLoading(true);

      const listingPayload = {
        ...listingData,
        reward_offered: rewardActive && !!reward ? reward : ''
      }

      const locationPayload = {
        point: {
          type: 'Point',
          coordinates: [
            location.coords!.latitude,
            location.coords!.longitude
          ]
        },
        address: location.address,
        location_type: 'approximate',
        is_primary: true,
        notes: '',
        accuracy_meters: location.radius
      }

      const resultListing = await axios.post(`${API_URL}/api/listings/`, listingPayload,
        {
          headers: { Authorization: `Bearer ${authState.token}`}
        })

      const listingId = resultListing.data.id;
      setNewListingId(listingId);

      await axios.post(`${API_URL}/api/listings/${listingId}/location/`, locationPayload, {
        headers: { Authorization: `Bearer ${authState.token}`}
      })

      for (let i=0; i<photos.length; i++) {
        const uri = photos[i]
        const filename = uri.split('/').pop() ?? 'photo.jpg'
        const match = /\.(\w+)/.exec(filename)
        const type = match ? `image/${match[1]}` : 'image/jpeg'
        const formData = new FormData();

        formData.append('photo', {uri, name:filename, type} as any);
        formData.append('order_index', String(i))

        await axios.post(`${API_URL}/api/listings/${listingId}/upload_photo/`, formData,
          {
            headers: {
              Authorization: `Bearer ${authState?.token}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        )
      }

      setSuccess(true);
    } catch (e) {
      console.log(e);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 400 }}
      >
        {listingData.type=="lost" && (
          <View className="bg-white mb-4 px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className={`p-2 rounded-lg ${rewardActive ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  <FontAwesome5 name="medal" size={16} color={rewardActive ? "#FFB800" : "#9CA3AF"} />
                </View>
                <Text className="font-bold ml-3 text-gray-800 text-[15px]">Award</Text>
              </View>
              <Switch
                value={rewardActive}
                onValueChange={toggleReward}
              />
            </View>

            {rewardActive && (
              <View className="mt-4">
                <View
                  className={`flex-row items-center border-2 rounded-xl px-3 py-1 ${
                    isConfirmed ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <TextInput
                    value={reward}
                    onChangeText={(text) => {
                      setReward(text);
                      setIsConfirmed(false);
                    }}
                    placeholder="Enter amount..."
                    keyboardType="numeric"
                    returnKeyType="done"
                    onSubmitEditing={handleConfirm}
                    className="flex-1 leading-tight h-12 text-gray-900 font-semibold text-lg"
                  />

                  <View className="flex-row items-center">
                    <Text className="mr-3 font-bold text-gray-400">PLN</Text>

                    <Pressable
                      onPress={handleConfirm}
                      disabled={reward.length === 0 || isConfirmed}
                      hitSlop={10}
                      className={`flex-row items-center px-3 py-2 rounded-lg active:scale-90 ${
                        isConfirmed ? 'bg-green-500' : 'bg-gray-600'
                      } ${reward.length === 0 ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <Text className="text-white font-bold text-xs mr-1">
                        {isConfirmed ? 'OK' : 'SET'}
                      </Text>
                      <FontAwesome5
                        name={isConfirmed ? "check" : "chevron-right"}
                        size={10}
                        color="white"
                      />
                    </Pressable>
                  </View>
                </View>

                {!isConfirmed && reward.length > 0 && (
                  <Text className="text-blue-500 text-[10px] mt-1 ml-1 font-medium italic">
                    Tap "Set" to save the amount
                  </Text>
                )}
              </View>
            )}

          </View>
        )}

        <View className="bg-white px-4 py-4 rounded-xl items-center justify-center mb-4">
          <Ionicons name="document-text-outline" size={34} color="gray" />
          <Text className="text-gray-400 font-bold">Summary Preview</Text>
          <Text className="text-sm text-gray-400 font-semibold">Review all your data before submitting the listing</Text>
        </View>

        <ListingCard
          item={{
            ...listingData,
            id: 0,
            status: 'active',
            primary_location: location.address,
            primary_photo: photos[0],
            created_at: '2000-01-01',
            reward_offered: reward,
            has_collar: listingData.has_collar ?? false,
            collar_color: listingData.collar_color ?? '',
            breed: listingData.breed ?? null,
            color: listingData.color ?? null,
            dog_name: listingData.dog_name ?? null,
            age_estimate: listingData.age_estimate ?? null,
          }}
          isPreview={true}
        />

        <View className="bg-white px-4 py-4 rounded-2xl mb-4 border border-gray-100 shadow-sm gap-4">
          <View>
            <Text className="font-bold text-gray-800 text-base mb-2">Full Description</Text>
            <Text>{listingData.description}</Text>
          </View>
          <Text className="font-bold text-gray-800 text-base">More details</Text>

          <View className="flex-row gap-2">
            {!!listingData.size && (
              <View className="flex-row items-center bg-gray-100 px-3 py-2 rounded-xl gap-2">
                <MaterialCommunityIcons name="ruler" size={16} color="#6b7280" />
                <Text className="text-gray-700 font-semibold text-sm capitalize">{listingData.size}</Text>
              </View>
            )}
            {!!listingData.gender && (
              <View className="flex-row items-center bg-gray-100 px-3 py-2 rounded-xl gap-2">
                <Ionicons
                  name={listingData.gender === 'male' ? 'male' : listingData.gender === 'female' ? 'female' : 'help-circle-outline'}
                  size={16}
                  color="#6b7280"
                />
                <Text className="text-gray-700 font-semibold text-sm capitalize">{listingData.gender}</Text>
              </View>
            )}
          </View>

          {!!listingData.special_marks && (
            <View className="bg-red-50 border border-red-100 rounded-xl p-3 gap-1">
              <Text className="text-red-400 text-xs font-bold uppercase tracking-wider">Special Marks</Text>
              <Text className="text-red-900 font-semibold">{listingData.special_marks}</Text>
            </View>
          )}

          {listingData.type === 'found' && !!listingData.fostering_address && (
            <View className="gap-1">
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Fostering address</Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="home-outline" size={16} color="#6b7280" />
                <Text className="text-gray-700 font-semibold">{listingData.fostering_address}</Text>
              </View>
            </View>
          )}

          {(!!location.address || !!location.coords) && (
            <View className="relative">
              <MapView
                style={{height: 300, borderRadius:12, marginBottom:10}}
                initialRegion={{
                  latitude: location.coords!.latitude,
                  longitude: location.coords!.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <>
                  <Marker
                    coordinate={location.coords!}
                  />
                  <Circle
                    center={location.coords!}
                    radius={location.radius}
                    fillColor="rgba(0,0,255,0.1)"
                    strokeColor="blue"
                  />
                </>
              </MapView>

                <View className="absolute top-2 left-2 right-2 bg-white/90 p-2 rounded-lg z-50">
                  <Text className="text-red-500">{location.address}</Text>
                </View>
            </View>
          )}

          {photos.length > 1 && (
            <View className="gap-2">
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Photos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                {photos.map((uri, i) => (
                  <Image key={i} source={{ uri }} className="w-24 h-24 rounded-xl mr-2" />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        
        {!!error && (
          <Text className="text-red-500 text-sm font-medium text-center mb-2">{error}</Text>
        )}

        <Pressable
          onPress={handleCreateListing}
          disabled={loading}
          className={`items-center bg-green-600 rounded-2xl py-4 ${loading ? 'opacity-60' : ''}`}
        >
          <Text className="text-white font-bold text-xl">Create Listing</Text>
        </Pressable>

      </ScrollView>

      <Modal visible={loading || success} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white w-full rounded-2xl p-6 items-center gap-3">

            {loading ? (
              <>
                <ActivityIndicator size="large" color="#16a34a" />
                <Text className="text-gray-800 font-bold text-lg">Creating listing...</Text>
                <Text className="text-gray-400 text-sm">Please wait a moment</Text>
              </>
            ) : (
              <>
                <FontAwesome5 name="check" size={24} color="#16a34a"/>
                <Text className="text-xl font-bold text-center text-gray-800">Listing created!</Text>
                <Text className="text-gray-500 text-center text-sm">What do you want to do next?</Text>

                <Pressable
                  className="bg-green-600 w-full py-4 rounded-xl items-center mt-2"
                  onPress={() => { resetForm(); router.push(`/listing/${newListingId}`); }}
                >
                  <Text className="text-white font-bold text-base">See my listing</Text>
                </Pressable>

                <Pressable
                  className="w-full py-3 items-center"
                  onPress={() => { resetForm(); router.replace('/(tabs)'); }}
                >
                  <Text className="text-green-600 font-semibold text-base">Go to home screen</Text>
                </Pressable>
              </>
            )}

          </View>
        </View>
      </Modal>
    </>
  )
}

export default FinalStep