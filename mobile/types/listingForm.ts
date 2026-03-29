import { ListingItem, ListingType } from "@/types/listing";

export type Coords = {
  latitude: number;
  longitude: number;
};

export type LocationState = {
  id?: number;
  coords: Coords | null;
  radius: number;
  address: string | null;
};

export interface ListingFormScreenProps {
  id?: string;
  mode: 'create' | 'edit';
  initialListing?: ListingItem;
};

export type PhotoManage = {
  type: 'existing' | 'new';
  id?: number;
  cloudinary_url?: string;
  uri?: string;
}

export interface ListingCreate {
  type: ListingType;
  title: string;
  description: string;
  breed?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  gender?: 'male' | 'female' | 'unknown';
  has_collar?: boolean;
  collar_color?: string;
  dog_name?: string;
  age_estimate?: string;
  special_marks?: string;
  fostering_address?: string;
  reward_offered?: string;
  search_radius_km?: number;
}
