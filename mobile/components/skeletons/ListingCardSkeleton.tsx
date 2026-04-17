import { View } from 'react-native';
import React from 'react';
import { Skeleton } from 'moti/skeleton';

const ListingCardSkeleton = () => (
  <View className="bg-white rounded-2xl overflow-hidden mb-4 pb-2 shadow-sm border border-gray-100">
    <View className="items-center flex-row pt-3 pb-1 px-4">
      <Skeleton colorMode="light" width="80%" height={22} />
    </View>
    <View className="flex-row pt-2 px-2">
      <View className="mr-4">
        <Skeleton colorMode="light" width={160} height={160} radius={8} />
        <View className="mt-2">
          <Skeleton colorMode="light" width={120} height={16} />
        </View>
      </View>
      <View className="flex-1 gap-2">
        <Skeleton colorMode="light" width="100%" height={20} />
        <Skeleton colorMode="light" width="90%" height={20} />
        <Skeleton colorMode="light" width="95%" height={20} />
        <View className="flex-row gap-2 mt-1">
          <Skeleton colorMode="light" width={70} height={28} radius={99} />
          <Skeleton colorMode="light" width={60} height={28} radius={99} />
        </View>
      </View>
    </View>
  </View>
)

export default ListingCardSkeleton