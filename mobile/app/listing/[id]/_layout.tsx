import { Stack, useLocalSearchParams } from 'expo-router';
import { ListingProvider } from '@/contexts/ListingContext';


const ListingLayout = () => {
  const { id } = useLocalSearchParams();

  if (typeof id !== 'string'){
    return null;
  }

  return (
    <ListingProvider id={id}>
      <Stack screenOptions={{ headerShown: false }} />
    </ListingProvider>
  )
}

export default ListingLayout