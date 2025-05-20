import axios from 'axios';
import { API_URL } from '../shared/constants';
import type { Tag } from '../types/tag';
import type { Story, StoryFilter, StoryPatch } from '../types/story';
import type { Place, PlaceFilter, PlacePatch } from '../types/place';

// Configure axios defaults
axios.defaults.baseURL = `${API_URL}/api/v1`;

// Add request interceptor to set the token
export const setupAxiosInterceptors = (token: string) => {
  // Clear previous interceptors to avoid duplicates
  axios.interceptors.request.clear();
  
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

// Initialize with token from localStorage if available
const token = localStorage.getItem('token');
if (token) {
  setupAxiosInterceptors(token);
}

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

// Stories API calls
export const fetchStories = async (filter: StoryFilter = {}) => {
  const response = await axios.post('/stories/filter', filter);
  return response.data;
};

export const fetchStoryById = async (id: string) => {
  if (!id) throw new Error("Story ID is required");
  const response = await axios.get(`/stories/id/${id}`);
  return response.data;
};

export const createStory = async (storyData: Story) => {
  try {
    console.log("Creating story with data:", JSON.stringify(storyData));
    const response = await axios.post('/stories', storyData);
    console.log("Story created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to create story:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Server response:", error.response.data);
    }
    throw error;
  }
};

export const updateStory = async (storyData: StoryPatch) => {
  if (!storyData.id) throw new Error("Story ID is required for updates");
  try {
    console.log("Updating story with data:", JSON.stringify(storyData));
    const response = await axios.patch('/stories', storyData);
    console.log("Story updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update story:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Server response:", error.response.data);
    }
    throw error;
  }
};

export const deleteStory = async (id: string) => {
  if (!id) throw new Error("Story ID is required");
  const response = await axios.delete(`/stories/id/${id}`);
  return response.data;
};

// Places API calls
export const fetchPlaces = async (filter: PlaceFilter = {}) => {
  const response = await axios.post('/places/filter', filter);
  return response.data;
};

export const fetchPlaceById = async (id: number) => {
  if (!id) throw new Error("Place ID is required");
  const response = await axios.get(`/places/id/${id}`);
  return response.data;
};

export const createPlace = async (placeData: Place) => {
  try {
    console.log("Creating place with data:", JSON.stringify(placeData));
    const response = await axios.post('/places', placeData);
    console.log("Place created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to create place:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Server response:", error.response.data);
    }
    throw error;
  }
};

export const updatePlace = async (placeData: PlacePatch) => {
  if (!placeData.id) throw new Error("Place ID is required for updates");
  try {
    console.log("Updating place with data:", JSON.stringify(placeData));
    const response = await axios.patch('/places', placeData);
    console.log("Place updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update place:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Server response:", error.response.data);
    }
    throw error;
  }
};

export const deletePlace = async (id: number) => {
  if (!id) throw new Error("Place ID is required");
  const response = await axios.delete(`/places/id/${id}`);
  return response.data;
}; 