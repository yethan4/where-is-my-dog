import { useListing } from "@/contexts/ListingContext";
import React from 'react';
import ListingFormScreen from "@/components/manage-listing/ListingFormScreen";
import { View } from "react-native";

const edit = () => {
  const { listing: listingData, loading } = useListing()

  return (
    <View className="pt-safe flex-1">
      <ListingFormScreen mode="edit" initialListing={listingData} />
    </View>
  )
}

export default edit