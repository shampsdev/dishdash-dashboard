import axios from "axios";
import { Place } from "@/interfaces/place.interface";
import { useSettingsStore } from "../stores/settings.store";

const API_URL = "https://dishdash.ru";

export const fetchPlaces = async (): Promise<Place[]> => {
  const api_key = useSettingsStore.getState().api_key;
  try {
    const response = await axios.get<Place[]>(`${API_URL}/api/v1/places`, {
      headers: {
        "X-API-Token": api_key,
      },
    });

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(`Error fetching places: ${err.message}`, {
        status: err.response?.status,
        data: err.response?.data,
      });
    } else {
      console.error(`Unexpected error fetching places: ${err}`);
    }

    throw err;
  }
};

export const updatePlace = async (place: Place): Promise<Place> => {
  const api_key = useSettingsStore.getState().api_key;

  try {
    const response = await axios.put<Place>(
      `${API_URL}/api/v1/places`,
      {
        ...place,
        priceMin: Math.trunc(place.priceAvg),
        tags: place.tags.flatMap((x) => x.id),
      },
      {
        headers: {
          "X-API-Token": api_key,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(`Error updating place: ${err.message}`, {
        status: err.response?.status,
        data: err.response?.data,
      });
    } else {
      console.error("Unexpected error updating place:", err);
    }

    throw err;
  }
};

export const savePlace = async (place: Place): Promise<Place> => {
  const api_key = useSettingsStore.getState().api_key;

  try {
    const response = await axios.post<Place>(
      `${API_URL}/api/v1/places`,
      {
        ...place,
        priceMin: Math.trunc(place.priceAvg),
        tags: place.tags.flatMap((x) => x.id),
      },
      {
        headers: {
          "X-API-Token": api_key,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(`Error updating place: ${err.message}`, {
        status: err.response?.status,
        data: err.response?.data,
      });
    } else {
      console.error("Unexpected error updating place:", err);
    }

    throw err;
  }
};

export const deletePlace = async (place: Place): Promise<Place> => {
  const api_key = useSettingsStore.getState().api_key;

  try {
    const response = await axios.delete<Place>(
      `${API_URL}/api/v1/places/${place.id}`,
      {
        headers: {
          "X-API-Token": api_key,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(`Error deleting place: ${err.message}`, {
        status: err.response?.status,
        data: err.response?.data,
      });
    } else {
      console.error("Unexpected error deleting place:", err);
    }

    throw err;
  }
};