import axios from 'axios';
import { API_URL } from '../shared/constants';
import type { Tag } from '../types/tag';

// Configure axios defaults
axios.defaults.baseURL = `${API_URL}/api/v1`;

// Add request interceptor to set the token
export const setupAxiosInterceptors = (token: string) => {
  axios.interceptors.request.use(
    (config) => {
      config.headers['X-API-Token'] = token;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Tag API calls
export const fetchTags = async () => {
  const response = await axios.get('/places/tag');
  return response.data;
};

export const createTag = async (tagData: FormData) => {
  const response = await axios.post('/places/tag', tagData);
  return response.data;
};

export const updateTag = async (id: number, formData: FormData) => {
  // Convert FormData to a tag object
  const tagData: Partial<Tag> = {
    id: id,
    name: formData.get('name') as string,
    icon: formData.get('icon') as string,
    visible: formData.get('visible') === 'true',
    order: parseInt(formData.get('order') as string),
    excluded: formData.get('excluded') === 'true'
  };
  
  const response = await axios.put('/places/tag', tagData);
  return response.data;
};

export const deleteTag = async (id: number) => {
  const response = await axios.delete(`/places/tag/id/${id}`);
  return response.data;
}; 