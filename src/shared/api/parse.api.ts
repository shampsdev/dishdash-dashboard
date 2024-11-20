import { Place } from "@/interfaces/place.interface";
import axios from "axios";
import { useSettingsStore } from "../stores/settings.store";

const API_URL = "http://localhost:8000";

export const parsePlace = async (url: string) => {
    const api_key = useSettingsStore.getState().api_key;

    const response = await axios.get<Omit<Place, 'id'>>(`${API_URL}/api/v1/places`, {
        params: {
            url,
        },
        headers: {
            'X-API-Token': api_key,
        },
    });

    return response.data;
}
