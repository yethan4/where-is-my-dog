import { View } from 'react-native'
import React from 'react'
import ListingFormScreen from "@/components/manage-listing/ListingFormScreen";


const create = () => {

  return (
    <View className="pt-safe flex-1">
      <ListingFormScreen mode="create" />
    </View>
  )
}

export default create