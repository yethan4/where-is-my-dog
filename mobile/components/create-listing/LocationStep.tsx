import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import React, { useRef, useState } from 'react';
import { Ionicons } from "@expo/vector-icons";

import * as Location from 'expo-location';
import MapView, { Marker, Circle } from 'react-native-maps';

import Slider from '@react-native-community/slider'

const LocationStep = () => {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [radius, setRadius] = useState(300);
  const [address, setAddress] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);

  const getCurrentLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    console.log(loc.coords);
    setCoords({latitude: loc.coords.latitude, longitude: loc.coords.longitude });

    mapRef.current?.animateToRegion({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    }, 800);

    resolveAddressAsync(loc.coords.latitude, loc.coords.longitude);
  }

  const resolveAddressAsync = async (latitude: number, longitude: number) => {
    const results = await Location.reverseGeocodeAsync({latitude, longitude});
    if(results.length > 0){
      const r = results[0];

      const parts = [r.street, r.district, r.city].filter(Boolean);
      setAddress(parts.join(', '));
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 400 }}
    >
      <View className="bg-white px-4 py-4 rounded-xl mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-sharp" size={24} />
          <Text className="ml-2 uppercase text-xl font-semibold">location</Text>
        </View>
        <View>
          <Text className="mb-2 text-gray-700">Choose your dog's location.</Text>
          <Pressable
            onPress={getCurrentLocationAsync}
            className="flex-row bg-black gap-2 justify-center items-center py-3 rounded-xl mb-4"
          >
            <Ionicons name="navigate" size={24} color="white" />
            <Text className="text-white text-lg font-semibold ">Use My Current Location</Text>
          </Pressable>
        </View>
      </View>

      <View className="bg-white pt-2 rounded-xl">

        <Text className="px-4 mb-2 font-semibold text-gray-800">Tap the map to select a location</Text>

        <View className="relative">
          <MapView
            ref={mapRef}
            style={{ height: 300, borderRadius: 12, marginBottom: 10 }}
            initialRegion={{
              latitude: 51.2465,
              longitude: 22.5684,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setCoords({ latitude, longitude });
              resolveAddressAsync(latitude, longitude);
            }}
          >
            {coords && (
              <>
                <Marker
                  coordinate={coords}
                  draggable
                  onDragEnd={(e) => setCoords(e.nativeEvent.coordinate)}
                />
                <Circle
                  center={coords}
                  radius={radius}
                  fillColor="rgba(0,0,255,0.1)"
                  strokeColor="blue"
                />
              </>
            )}
          </MapView>

          {!!address && (
            <View className="absolute top-2 left-2 right-2 bg-white/90 p-2 rounded-lg z-50">
              <Text className="text-red-500">{address}</Text>
            </View>
          )}

        </View>

        <Slider
          style={{ marginHorizontal: 16 }}
          minimumValue={0}
          maximumValue={1000}
          step={50}
          value={radius}
          onValueChange={setRadius}
        />
        <Text className="mb-2 text-gray-600 text-sm font-bold text-center">Location {radius}m radius</Text>

      </View>

    </ScrollView>
  )
}

export default LocationStep