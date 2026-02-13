import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from "expo-router"
import axios from "axios";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface UserPreview {
	id: number;
	username: string;
	profile_photo: string | null;
}

interface LocationPoint {
  type: 'Point';
  coordinates: [number, number]; // long, lat
}

interface ListingLocation {
  id: number;
  added_by_user: number;
  listing: number;
  latitude: string;
  longitude: string;
  point: LocationPoint;
  address: string | null;
  location_type: 'exact' | 'approximate';
  is_primary: boolean;
  notes: string | null;
  accuracy_meters: number | null;
  created_at: string;
}

interface ListingPhoto {
  id: number;
  cloudinary_url: string;
  thumbnail_url: string;
  order_index: number;
  uploaded_at: string;
}


type ListingType = 'lost' | 'found'
type ListingStatus = 'active' | 'expired' | 'found' | 'returned'

interface ListingItem {
  id: number;
  user: UserPreview;
  type: ListingType;
  status: ListingStatus;
  title: string;
  description: string;
  breed: string | null;
  size: string | null;
  color: string | null;
  gender: 'male' | 'female' | 'unknown';
  has_collar: boolean;
  collar_color: string | null;
  dog_name: string | null;
  age_estimate: string | null;
  special_marks: string | null;
  fostering_address: string | null;
  reward_offered: string | null;
  search_radius_km: number;
  photos: ListingPhoto[];
  photo_count: number;
  locations: ListingLocation[];
  primary_location: ListingLocation | null;
  created_at: string;
  updated_at: string;
}


const Details = () => {
	const { id } = useLocalSearchParams();
	const [listingData, setListingData] = useState<ListingItem>();
	const [loading, setLoading] = useState<boolean>();

	const router = useRouter();

	const API_URL = process.env.EXPO_PUBLIC_API_URL;
	
	const fetchListing = async() => {
		setLoading(true);
		try{
			const response = await axios.get<ListingItem>(`${API_URL}/api/listings/${id}/`);
			setListingData(response.data);
		} catch (error) {
			console.error('Failed to fetch listing:', error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchListing();
	}, [id])

	const hasName = !!listingData?.dog_name;

	const mainTitle = hasName ? listingData?.dog_name : listingData?.breed;

	const subTitle = hasName
  ? [listingData?.breed, listingData?.age_estimate].filter(Boolean).join(' • ')
  : listingData?.age_estimate;


	return (
		<View className="flex-1">
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
								source={require('../../assets/images/dog-placeholder.png')}
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
								{listingData?.user.username || "Anonim"}
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

			<Pressable className="absolute bottom-7 left-6 right-6 flex-row p-4 rounded-3xl items-center justify-center bg-slate-800">
				<Ionicons 
					name="chatbubbles" 
					color="white" 
					size={24}
				/>
				<Text className="text-white text-2xl font-bold ml-2">Message</Text>
			</Pressable>
		</View>
	)
}

export default Details