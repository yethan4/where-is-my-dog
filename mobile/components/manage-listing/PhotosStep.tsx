import { View, Text, Image, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { PhotoManage } from "@/types/listingForm";

type Props = {
  photos: PhotoManage[];
  toDeletePhotos: PhotoManage[]; 
  setPhotos: (photos: PhotoManage[]) => void;
  setToDeletePhotos: (photos: PhotoManage[]) => void;
}

const PhotosStep = ({photos, setPhotos, toDeletePhotos, setToDeletePhotos}: Props) => {
  const pickImageAsync = async() => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    console.log(result);

    if (!result.canceled) {
      setPhotos([
        ...photos,
        {
          type: 'new',
          uri: result.assets[0].uri
        }
      ]);
    }
  }

  const takePhotoAsync = async() => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Brak dostępu", "Musisz zezwolić na dostęp do aparatu, aby zrobić zdjęcie.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotos([
        ...photos,
        {
          type: 'new',
          uri: result.assets[0].uri
        }
      ]);
    }
  }

  const handleRemovePhoto = (idx: number) => {
    if (photos[idx].type === 'new') {
      setPhotos(photos.filter((_, i) => i !== idx))
    } else {
      setToDeletePhotos([...toDeletePhotos, photos[idx]])
      setPhotos(photos.filter((_, i) => i !== idx))
    }
  }

  const handleRestorePhoto = (id: number) => {
    const photo = toDeletePhotos.find((p) => p.id === id)
    if (!photo) return
    setToDeletePhotos(toDeletePhotos.filter((p) => p.id !== id))
    setPhotos([...photos, photo])
  }

  return (
    <View className="bg-white px-4 py-6 rounded-2xl">
      <View className="flex-row justify-between mb-1">
        <Text className="text-2xl font-bold uppercase">pictures</Text>
        <Text className="rounded-full tracking-widest text-sm bg-gray-100 px-3 py-1">{photos.length}/2</Text>
      </View>
      <Text className="text-sm text-gray-400 tracking-wide font-medium mb-4">Add up to 2 photos, the first will be the main one</Text>
      
      <View className="flex-row justify-between px-2 mb-10" >
        {!!photos[0] ? (
          <View className="w-44 h-44 bg-gray-100 rounded-xl items-center justify-center border border-dashed border-gray-400">
            <Image
              source={{ uri: photos[0].uri || photos[0].cloudinary_url }}
              className="w-full h-full rounded-xl"
            />
            <Pressable 
              onPress={() => handleRemovePhoto(0)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-md"
            >
              <Ionicons name="close" size={20} color="white" />
            </Pressable>
          </View>
        ) : (
          <View className="w-44 h-44 bg-gray-100 rounded-xl items-center justify-center border border-dashed border-gray-400">
            <Ionicons name="camera-outline" size={30} color="gray" />
          </View>
        )}
        
        {!!photos[1] ? (
          <View className="w-44 h-44 bg-gray-100 rounded-xl items-center justify-center border border-dashed border-gray-400">
            <Image
              source={{ uri: photos[1].uri || photos[1].cloudinary_url }}
              className="w-full h-full rounded-xl"
            />
            <Pressable
              onPress={() => handleRemovePhoto(1)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-md"
            >
              <Ionicons name="close" size={20} color="white" />
            </Pressable>
          </View>
        ) : (
          <View className="w-44 h-44 bg-gray-100 rounded-xl items-center justify-center border border-dashed border-gray-400">
            <Ionicons name="camera-outline" size={30} color="gray" />
          </View>
        )}
      </View>

      {toDeletePhotos.length > 0 && (
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Marked for deletion</Text>
          <View className="flex-row flex-wrap gap-3">
            {toDeletePhotos.map((photo) => (
              <View key={photo.id} className="w-20 h-20 rounded-xl overflow-hidden opacity-50">
                <Image
                  source={{ uri: photo.cloudinary_url }}
                  className="w-full h-full"
                />
                <Pressable
                  onPress={() => handleRestorePhoto(photo.id!)}
                  className="absolute inset-0 items-center justify-center bg-black/40"
                >
                  <Ionicons name="refresh" size={24} color="white" />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="flex-row px-2 justify-between gap-2">
        <Pressable 
          onPress={takePhotoAsync}
          disabled={photos.length >= 2}
          className="w-44 flex-row bg-gray-800 py-3 rounded-xl border-2 border-gray-800 justify-center items-center"
        >
          <Ionicons name="camera" size={24} color="white"/>
          <Text className="text-white font-semibold ml-2">Aparat</Text>
        </Pressable>

        <Pressable 
          onPress={pickImageAsync}
          disabled={photos.length >= 2}
          className="w-44 flex-row bg-white border-2 border-gray-800 py-3 rounded-xl justify-center items-center"
        >
          <MaterialIcons name="photo-library" size={24} color="black"/>
          <Text className="text-black font-semibold ml-2">Gallery</Text>
        </Pressable>
      </View>
      
    </View>
  )
}

export default PhotosStep