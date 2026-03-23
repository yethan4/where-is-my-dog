import { View, Text, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { ListingCreate } from "@/types/listing";
import { FontAwesome5 } from "@expo/vector-icons";
import BasicInfoStep from "@/components/create-listing/BasicInfoStep";
import DogDetailsStep from "@/components/create-listing/DogDetailsStep";
import LocationStep from "@/components/create-listing/LocationStep";
import PhotosStep from "@/components/create-listing/PhotosStep";
import FinalStep from "@/components/create-listing/FinalStep";

type Coords = {
  latitude: number;
  longitude: number;
};

export type LocationState = {
  coords: Coords | null;
  radius: number;
  address: string | null;
};

type StepCardProps = {
  step: number;
  listingState: ListingCreate;
  handleChange: (data: Partial<ListingCreate>) => void;
  photos: string[];
  setPhotos: (photos: string[]) => void;
  location: LocationState;
  setLocation: (location: LocationState) => void;
  setCanContinue: (f :boolean) => void;
};

const StepCard = ({ step, listingState, handleChange, setPhotos, photos, location, setLocation, setCanContinue }: StepCardProps) => {
  switch(step){
    case 1:
      return <BasicInfoStep onChange={handleChange} initialData={listingState} setCanContinue={setCanContinue} />
    case 2:
      return <DogDetailsStep onChange={handleChange} initialData={listingState} />
    case 3:
      return <PhotosStep photos={photos} setPhotos={setPhotos} />
    case 4:
      return <LocationStep location={location} setLocation={setLocation} listingType={listingState.type} setCanContinue={setCanContinue} />
    case 5:
      return <FinalStep listingData={listingState} photos={photos} location={location} />
    default:
      return null;
  }
};


const create = () => {
  const [currentStep, setCurrentStep] = useState<number>(1); // 1-basic info 2-dog details 3-photos 4-location 5-summary
  const [listingState, setListingState] = useState<ListingCreate>({
    type: 'lost',
    title: '',
    description: '',
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationState>({
    coords: null,
    radius: 300,
    address: null,
  });
  const [canContinue, setCanContinue] = useState<boolean>(false);

  const handleChange = useCallback((data: Partial<ListingCreate>): void => {
    setListingState(prev => ({ ...prev, ...data }))
  }, [])

  const StepIndicator = ({ step }: { step: number }) => {
    const isActive = currentStep === step;
    const isCompleted = currentStep > step;

    const labels = ["Basic", "Dog", "Photo", "Loc", "Final"];

    return (
        <View className="items-center flex-1 z-10">
          <View 
            className={`w-8 h-8 rounded-full items-center justify-center border-2 
              ${isActive ? 'bg-blue-600 border-blue-600' : isCompleted ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}
          >
            {isCompleted ? (
              <FontAwesome5 name="check" size={12} color="white" />
            ) : (
              <Text className={`${isActive ? 'text-white font-bold' : 'text-gray-500'}`}>{step}</Text>
            )}
          </View>
          <Text 
            numberOfLines={1}
            className={`text-[9px] mt-1 font-medium uppercase ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
          >
            {labels[step - 1]}
          </Text>
        </View>
      );
  };
  
  useEffect(() => {
    setCanContinue([2, 3].includes(currentStep));
  }, [currentStep])

  return (
    <View className="pt-safe px-4 flex-1">
      <View className="flex-row items-center justify-between py-6 border-b border-gray-200 mb-6">
        <Pressable 
          onPress={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
          className={`p-2 rounded-full ${currentStep === 1 ? 'opacity-0' : 'bg-gray-50'}`}
        >
          <FontAwesome5 name="chevron-left" size={16} color="#4b5563" />
        </Pressable>

        <View className="flex-row flex-1 px-4 items-center">
          {[1, 2, 3, 4, 5].map((s) => (
            <React.Fragment key={s}>
                <StepIndicator step={s} />
                {s < 5 && <View className={`h-[2px] flex-1 -mt-4 ${currentStep > s ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))

          }
        </View>

        <Pressable 
          className={`p-2 rounded-full ${currentStep === 5 || !canContinue ? 'opacity-0' : 'bg-gray-50'}`}
          onPress={() => currentStep < 5 && setCurrentStep(currentStep + 1)}
        >
          <FontAwesome5 name="chevron-right" size={16} color="#4b5563" />
        </Pressable>
      </View>
      <Pressable>
        <Text></Text>
      </Pressable>
      
      <View>
        <StepCard 
          step={currentStep} 
          listingState={listingState} 
          handleChange={handleChange}
          photos={photos}
          setPhotos={setPhotos}
          location={location}
          setLocation={setLocation}
          setCanContinue={setCanContinue}
        />
      </View>

      <Pressable 
        className={`absolute bottom-4 left-0 right-0 ${canContinue ? 'bg-slate-600' : 'bg-slate-300'} bg-slate-400 mx-6 rounded-xl py-4 flex items-center ${currentStep===5 && 'opacity-0'}`}
        disabled={!canContinue}
        onPress={() => (setCurrentStep(currentStep+1))}
      >
          <Text className="text-white font-bold">Continue</Text>
      </Pressable>
    </View>
  )
}

export default create