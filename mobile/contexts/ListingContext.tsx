import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ListingItem } from "@/types/listing";
import axios from 'axios'

interface ListingContextType {
  listing: ListingItem | undefined;
  loading: boolean;
  refetch: () => Promise<void>;
}

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const ListingProvider = ({ id, children }: {id: string, children: ReactNode}) => {
  const [listing, setListing] = useState<ListingItem>();
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const fetchListing = async () => {
    try{
      setLoading(true)
      const response = await axios.get<ListingItem>(`${API_URL}/api/listings/${id}/`)
      setListing(response.data)
    } catch (e) {
      console.log('Failed to fetch listing', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListing();
  }, [id])

  return (
    <ListingContext.Provider value={{listing, loading, refetch: fetchListing }}>
      {children}
    </ListingContext.Provider>
  )
}

export const useListing = () => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error('useListing must be used within ListingProvider')
  }
  return context;
}