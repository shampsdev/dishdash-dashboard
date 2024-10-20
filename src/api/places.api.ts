import axios from 'axios';
import { Place } from '@/interfaces/place.interface';

const API_URL = 'https://dishdash.ru';

export const fetchPlaces = async (): Promise<Place[] | undefined> => {
  try {
    const response = await axios.get<Place[]>(`${API_URL}/api/v1/places`);
    return response.data;
  } catch (err) {
    console.error('Error fetching tags:', err);
    return undefined;
  }
};

export const updatePlace = async (place: Place): Promise<Place | undefined> => {
  try {
    const response = await axios.put<Place>(`${API_URL}/api/v1/places`, {
      ...place,
      tags: place.tags.flatMap((x) => x.id),
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching tags:', err);
    return undefined;
  }
};
