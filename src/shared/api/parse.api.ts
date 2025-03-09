import { Place } from '@/interfaces/place.interface';
import axios from 'axios';
import { useSettingsStore } from '../stores/settings.store';

const API_URL = 'https://dashboard.dishdash.ru';

export const parsePlace = async (url: string) => {
  const api_key = useSettingsStore.getState().api_key;

  const response = await axios.get<Omit<Place, 'id'>>(`${API_URL}/api/parse/`, {
    params: {
      url,
    },
    headers: {
      'api-key': api_key,
    },
  });

  return response.data;
};

interface UploadImageByUrl {
  url: string;
}

export const uploadImageByUrl = async (url: string) => {
  const api_key = useSettingsStore.getState().api_key;

  const response = await axios.post<UploadImageByUrl>(
    `${API_URL}/api/v1/images/upload/by_url`,
    {
      url,
      directory: 'place',
    },
    {
      headers: {
        'X-API-Token': api_key,
      },
    }
  );

  return response.data;
};
