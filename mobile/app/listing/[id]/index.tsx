import { Image, Pressable, ScrollView, Text, View, Alert, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import axios from "axios";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ListingItem } from "@/types/listing";
import { useAuth } from "@/contexts/AuthContext";
import { useListing } from "@/contexts/ListingContext";


const Details = () => {
	const { id } = useLocalSearchParams();
	const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>('');

	const { authState } = useAuth();
  const { listing: listingData, loading } = useListing()
	const router = useRouter();

	const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handleDelete = () => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleteError('');
            try {
              setIsDeleting(true);
              await axios.delete(`${API_URL}/api/listings/${id}/`, {
                headers: { Authorization: `Bearer ${authState.token}` },
              });
              setDeleteSuccess(true);
            } catch (e) {
              console.log(e);
              setDeleteError('Something went wrong. Please try again.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

	useEffect(() => {
		setIsAuthor(authState?.user?.id == listingData?.user?.id)
	}, [authState?.user, listingData?.user])

	const hasName = !!listingData?.dog_name;

	const mainTitle = hasName ? listingData?.dog_name : listingData?.breed;

	const subTitle = hasName
  ? [listingData?.breed, listingData?.age_estimate].filter(Boolean).join(' • ')
  : listingData?.age_estimate;


	return (
		<View className="flex-1">
			<Stack.Screen options={{ headerShown: false }} />
			<ScrollView
				className="flex-1 bg-white"
			>
				<View className="relative">
					{!!listingData?.photos?.[0]?.cloudinary_url ? (
						<Image
							source={{ uri: listingData?.photos?.[0]?.cloudinary_url }}
							className="w-full h-96"
						/>) : (
							<Image
								source={require('../../../assets/images/dog-placeholder.png')}
								className="w-full h-96"
							/>
						)}

					<Pressable
						className="absolute top-12 left-4 z-10 bg-white/80 p-2 rounded-full shadow-sm"
						onPress={() => router.back()}
					>
						<Ionicons name="arrow-back" size={24} color="black" />
					</Pressable>
					<View className={`absolute bottom-8 left-6 px-4 py-1 rounded-full ${listingData?.type === 'lost' ? 'bg-red-600' : 'bg-green-600'}`}>
						<Text className="text-white uppercase text-sm font-semibold tracking-wide text-center">
							{listingData?.type === 'lost' ? 'Lost' : 'Found'}
						</Text>
					</View>
				</View>

				<View
					className="flex-1 -mt-6 rounded-t-3xl bg-white pt-6 px-4"
				>
					<View className="border-b pb-6 mb-4 border-gray-100">
						{!!mainTitle && (
							<Text className="text-3xl font-bold">
								{mainTitle}
							</Text>
						)}


						{!!subTitle && (
							<Text className="text-gray-600 tracking-wide mt-1">
								{subTitle}
							</Text>
						)}


						{!!listingData?.reward_offered && (
							<View className="flex-row items-center bg-yellow-50 p-3 rounded-xl self-start mt-4 border border-yellow-100">
								<FontAwesome5 name="award" size={18} color="#EAB308" />
								<Text className="ml-2 font-bold text-yellow-700">
									Reward: {listingData?.reward_offered} PLN
								</Text>
							</View>
						)}
					</View>

					<View className="flex-row flex-wrap justify-around border-b pb-6 pt-4 mb-6 border-gray-100">

						<View className="flex items-center gap-1 w-20">
							<MaterialCommunityIcons name="ruler" size={20} color="#9CA3AF" ></MaterialCommunityIcons>
							<Text className="text-sm text-gray-400">Size</Text>
							<Text className="text-gray-700 font-bold text-sm">{listingData?.size}</Text>
						</View>

						<View className="flex items-center gap-1 w-20">
							<MaterialCommunityIcons
									name={listingData?.has_collar ? "link-variant" : "link-variant-off"}
									size={20}
									color={listingData?.has_collar ? "#9CA3AF" : "#dc2626"}
							/>
							<Text className="text-sm text-gray-400">Collar</Text>
							<Text className="text-gray-700 font-bold text-sm">
									{listingData?.has_collar ? `${listingData?.collar_color}` : "No collar"}
							</Text>
						</View>

						<View className="flex items-center gap-1 w-20">
							<Ionicons name="color-palette-sharp" size={20} color="#9CA3AF" />
							<Text className="text-sm text-gray-400">Color</Text>
							<Text className="text-gray-700 font-bold text-center text-sm">{listingData?.color}</Text>
						</View>

						<View className="flex items-center gap-1 w-20">
							<Ionicons name="paw" size={20} color="#9CA3AF" />
							<Text className="text-sm text-gray-400">Marks</Text>
							<Text className="text-gray-700 font-bold text-sm">{!!listingData?.special_marks ? 'yes' : 'no'}</Text>
						</View>

					</View>

					{!!listingData?.special_marks && (
						<View className="mx-4 mb-6 overflow-hidden rounded-2xl bg-red-50 border border-red-100 shadow-sm">
							<View className="flex-row items-center p-4">
								<View>
									<Ionicons name="alert-circle" size={22} color="white" />
								</View>

								<View className="ml-4 flex-1">
									<Text className="text-red-400 text-xs font-bold uppercase tracking-wider">
										Special Marks
									</Text>
									<Text className="text-red-900 text-lg font-semibold leading-6">
										{listingData?.special_marks}
									</Text>
								</View>

								<Ionicons name="paw" size={24} color="#fca5a5" style={{ opacity: 0.3 }} />
							</View>
						</View>
					)}

					<View className="mb-6">
						<Text className="font-semibold text-lg mb-1">Description</Text>
						<Text className="text-gray-600 text-base">
							{listingData?.description}
						</Text>
					</View>

					<View className="mb-7">
						<Text className="text-lg font-semibold mb-2">Last Location</Text>
						<View className="flex gap-2">
							<View
								className="flex-row items-center px-4 py-2 rounded-lg bg-gray-50 border border-gray-100 "
							>
								<Ionicons name="location" size={24} color="#EF4444" />

									<View className="flex-col ml-6">
										<Text className="font-semibold tracking-wider">{listingData?.primary_location?.address}</Text>
										<View className="flex-row gap-2">
											<Text className="tracking-wide">{listingData?.primary_location?.latitude && `Lat: ${parseFloat(listingData?.primary_location?.latitude).toFixed(4)},`}</Text>
											<Text className="tracking-wide">{listingData?.primary_location?.longitude && `Long: ${parseFloat(listingData?.primary_location?.longitude).toFixed(4)}`}</Text>
										</View>
										<Pressable className="">
											<Text className="text-xs tracking-wide text-gray-600 mt-1">Click to view on the map</Text>
										</Pressable>
									</View>
							</View>
						</View>
					</View>

					<View className="flex flex-row items-center p-4 bg-white border-t border-gray-100 rounded-2xl">
						<View className="w-12 h-12 items-center justify-center rounded-full bg-indigo-50">
							<Text className="text-sm font-bold text-indigo-300 uppercase">IMG</Text>
						</View>

						<View className="ml-3 flex-1 justify-center">
							<Text className="text-base font-bold text-gray-800 leading-tight">
								{listingData?.user?.username || "Anonim"}
							</Text>
							<Text className="text-xs font-medium text-gray-400">
								Author
							</Text>
						</View>

						<View className="self-start mt-4">
							<Text className="text-[11px] font-semibold text-gray-300 uppercase tracking-tighter">
								{listingData?.updated_at?.split("T")[0]}
							</Text>
						</View>
					</View>

				</View>

				<View className="h-28 w-full bg-gray-100">

				</View>
			</ScrollView>

			{!isAuthor && (<Pressable className="absolute bottom-7 left-6 right-6 flex-row p-4 rounded-3xl items-center justify-center bg-slate-800">
				<Ionicons
					name="chatbubbles"
					color="white"
					size={24}
				/>
				<Text className="text-white text-2xl font-bold ml-2">Message</Text>
			</Pressable>
			)}

			{isAuthor && (
				<View className="absolute bottom-10 left-6 right-6 flex-row justify-between gap-3">
					<Pressable
            onPress={() => router.push(`/listing/${id}/edit`)}
            className="bg-slate-800 flex-1 py-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm active:opacity-80"
          >
						<Ionicons name="pencil-sharp" size={18} color="white" />
						<Text className="text-white text-lg font-semibold">Edit</Text>
					</Pressable>
					<Pressable
            className="bg-red-50 border border-red-200 px-6 py-4 rounded-2xl items-center justify-center active:bg-red-100"
            onPress={handleDelete}
          >
						<Ionicons name="trash-outline" size={20} color="#ef4444" />
					</Pressable>
				</View>
			)}

			<Modal visible={isDeleting || deleteSuccess} transparent animationType="fade">
				<View className="flex-1 justify-center items-center bg-black/50 px-6">
					<View className="bg-white w-full rounded-2xl p-6 items-center gap-3">

						{isDeleting ? (
							<>
								<ActivityIndicator size="large" color="#ef4444" />
								<Text className="text-gray-800 font-bold text-lg">Deleting listing...</Text>
								<Text className="text-gray-400 text-sm">Please wait a moment</Text>
							</>
						) : (
							<>
								<FontAwesome5 name="check" size={24} color="#ef4444" />
								{!!deleteError ? (
									<Text className="text-red-500 text-sm font-medium text-center">{deleteError}</Text>
								): (
                  <Text className="text-xl font-bold text-center text-gray-800">Listing deleted!</Text>
                )}

								<Pressable
									className="bg-slate-800 w-full py-4 rounded-xl items-center mt-2"
									onPress={() => router.replace('/(tabs)')}
								>
									<Text className="text-white font-bold text-base">Go to home screen</Text>
								</Pressable>
							</>
						)}

					</View>
				</View>
			</Modal>
		</View>
	)
}

export default Details
