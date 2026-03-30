import { View, Text, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { FontAwesome5 } from "@expo/vector-icons";
import BasicInfoStep from "@/components/manage-listing/BasicInfoStep";
import DogDetailsStep from "@/components/manage-listing/DogDetailsStep";
import LocationStep from "@/components/manage-listing/LocationStep";
import PhotosStep from "@/components/manage-listing/PhotosStep";
import { ListingCreate, ListingFormScreenProps, LocationState, PhotoManage } from "@/types/listingForm";
import CreateFinalStep from "./CreateFinalStep";
import EditFinalStep from "./EditFinalStep";
import { ListingItem } from "@/types/listing";

type StepCardProps = {
  listingId: string;
  step: number;
  listingState: ListingCreate;
  handleChange: (data: Partial<ListingCreate>) => void;
  photos: PhotoManage[];
  setPhotos: (photos: PhotoManage[]) => void;
  location: LocationState;
  setLocation: (location: LocationState) => void;
  setCanContinue: (f: boolean) => void;
  resetForm: () => void;
  confirmedReward: string;
  setConfirmedReward: (reward: string) => void;
  mode: 'create' | 'edit';
  toDeletePhotos: PhotoManage[];
  setToDeletedPhotos: (photos: PhotoManage[]) => void;
  initialListing?: ListingItem;
};

const StepCard = ({ listingId, step, listingState, handleChange, setPhotos, photos, location, setLocation, setCanContinue, resetForm, confirmedReward, setConfirmedReward, mode, toDeletePhotos, setToDeletedPhotos, initialListing }: StepCardProps) => {
  switch(step){
    case 1:
      return <BasicInfoStep onChange={handleChange} initialData={listingState} setCanContinue={setCanContinue} />
    case 2:
      return <DogDetailsStep onChange={handleChange} initialData={listingState} />
    case 3:
      return <PhotosStep photos={photos} setPhotos={setPhotos} setToDeletePhotos={setToDeletedPhotos} toDeletePhotos={toDeletePhotos}/>
    case 4:
      return <LocationStep location={location} setLocation={setLocation} listingType={listingState.type} setCanContinue={setCanContinue} />
    case 5:
      if (mode=='create') {
        return <CreateFinalStep listingData={listingState} photos={photos} location={location} resetForm={resetForm} confirmedReward={confirmedReward} setConfirmedReward={setConfirmedReward} />
      } else {
        return <EditFinalStep listingData={listingState} photos={photos} location={location} resetForm={resetForm} confirmedReward={confirmedReward} setConfirmedReward={setConfirmedReward} listingId={listingId} initialListing={initialListing!} toDeletePhotos={toDeletePhotos} />
      }
    default:
      return null;
  }
};


const ListingFormScreen = ({id, mode, initialListing}: ListingFormScreenProps) => {
  const [loadingState, setLoadingState] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(1); // 1-basic info 2-dog details 3-photos 4-location 5-summary
  const [existingListingId, setExistingListingId] = useState<string>("");
  const [listingState, setListingState] = useState<ListingCreate>({
    type: 'lost',
    title: '',
    description: '',
  });
  const [photos, setPhotos] = useState<PhotoManage[]>([]);
  const [toDeletePhotos, setToDeletePhotos] = useState<PhotoManage[]>([]);
  const [location, setLocation] = useState<LocationState>({
    coords: null,
    radius: 300,
    address: null,
  });
  const [confirmedReward, setConfirmedReward] = useState<string>("");
  const [canContinue, setCanContinue] = useState<boolean>(false);

  const handleChange = useCallback((data: Partial<ListingCreate>): void => {
    setListingState(prev => ({ ...prev, ...data }))
  }, [])

  const resetForm = () => {
    setListingState({
      type: 'lost',
      title: '',
      description: '',
    });
    setPhotos([]);
    setLocation({
      coords: null,
      radius: 300,
      address: null,
    });
    setCurrentStep(1);
  }

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
    if ([2, 3].includes(currentStep)) {
      setCanContinue(true);
    } else if (currentStep === 1) {
      setCanContinue(listingState.title.trim().length > 0 && listingState.description.trim().length > 0);
    } else if (currentStep === 4) {
      setCanContinue(location.coords !== null);
    }
  }, [currentStep, listingState.title, listingState.description, location.coords])

  useEffect(() => {
    if (!initialListing) {
      setLoadingState(false);
      return
    }
    setExistingListingId(String(initialListing?.id))
    setListingState({
        type: initialListing.type,
        title: initialListing.title,
        description: initialListing.description,
        breed: initialListing.breed ?? undefined,
        size: (initialListing.size as ListingCreate['size']) ?? undefined,
        color: initialListing.color ?? undefined,
        gender: initialListing.gender,
        has_collar: initialListing.has_collar,
        collar_color: initialListing.collar_color ?? undefined,
        dog_name: initialListing.dog_name ?? undefined,
        age_estimate: initialListing.age_estimate ?? undefined,
        special_marks: initialListing.special_marks ?? undefined,
        fostering_address: initialListing.fostering_address ?? undefined,
        reward_offered: initialListing.reward_offered ?? undefined,
        search_radius_km: initialListing.search_radius_km,
    });
    setPhotos(initialListing.photos.map(p => ({ type: 'existing' as const, id: p.id, cloudinary_url: p.cloudinary_url })))
    if(initialListing.locations){
        const initialLocation = initialListing.locations[0];
        setLocation({
            id: initialLocation.id,
            coords: {
              latitude: initialLocation.point.coordinates[1],
              longitude: initialLocation.point.coordinates[0]
            },
            radius: initialLocation.accuracy_meters ,
            address: initialLocation.address
        })

    };
    setConfirmedReward(initialListing.reward_offered ?? "");
    setLoadingState(false);

  }, [initialListing])

  return (
    <View className="px-4 flex-1">
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
        {!loadingState && (<StepCard 
          step={currentStep} 
          listingState={listingState} 
          handleChange={handleChange}
          photos={photos}
          setPhotos={setPhotos}
          location={location}
          setLocation={setLocation}
          setCanContinue={setCanContinue}
          resetForm={resetForm}
          confirmedReward={confirmedReward}
          setConfirmedReward={setConfirmedReward}
          listingId={existingListingId}
          mode={mode}
          setToDeletedPhotos={setToDeletePhotos}
          toDeletePhotos={toDeletePhotos}
          initialListing={initialListing}
        />)}
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

export default ListingFormScreen