import { View, Text, Pressable, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome5 } from "@expo/vector-icons"
import ListingCard from "../ListingCard"
import { ListingCreate, LocationState, PhotoManage } from "@/types/listingForm"
import { useAuth } from "@/contexts/AuthContext"
import axios from 'axios';
import { useRouter } from "expo-router"
import FinalStep from "./FinalStep"

type Props = {
  listingData: ListingCreate;
  photos: PhotoManage[];
  location: LocationState;
  resetForm: () => void;
  confirmedReward: string;
  setConfirmedReward: (reward: string) => void;
}

const EditFinalStep = ({listingData, photos, location, resetForm, confirmedReward, setConfirmedReward}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const { authState } = useAuth();
  const router = useRouter();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handleUpdateListing = async () => {
    setSuccess(true);
  }

  return (
    <>
      <FinalStep
        type="edit"
        listingData={listingData}
        photos={photos}
        location={location}
        resetForm={resetForm}
        onSaveListing={handleUpdateListing}
        loading={loading}
        error={error}
        confirmedReward={confirmedReward}
        setConfirmedReward={setConfirmedReward}
    />

      <Modal visible={loading || success} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white w-full rounded-2xl p-6 items-center gap-3">

            {loading ? (
              <>
                <ActivityIndicator size="large" color="#16a34a" />
                <Text className="text-gray-800 font-bold text-lg">Updating listing...</Text>
                <Text className="text-gray-400 text-sm">Please wait a moment</Text>
              </>
            ) : (
              <>
                <FontAwesome5 name="check" size={24} color="#16a34a"/>
                <Text className="text-xl font-bold text-center text-gray-800">Listing updated!</Text>
                <Text className="text-gray-500 text-center text-sm">Your listing has been saved.</Text>

                <Pressable
                  className="bg-green-600 w-full py-4 rounded-xl items-center mt-2"
                  onPress={() => { resetForm(); router.back(); }}
                >
                  <Text className="text-white font-bold text-base">Back to listing</Text>
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

export default EditFinalStep