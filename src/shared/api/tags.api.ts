import { Tag } from '@/interfaces/place.interface';
import axios from 'axios';

const API_URL = 'https://dishdash.ru';

export const fetchTags = async (): Promise<Tag[] | undefined> => {
  try {
    const response = await axios.get<Tag[]>(`${API_URL}/api/v1/places/tag`);
    return response.data;
  } catch (err) {
    console.error('Error fetching tags:', err);
    return undefined;
  }
};
