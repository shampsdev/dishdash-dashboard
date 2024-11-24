import { Place } from "@/interfaces/place.interface";
import axios from "axios";
import { useSettingsStore } from "../stores/settings.store";

const API_URL = "https://parser.dishdash.ru";

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
}

export const uploadImageByUrl = async (url: string) => {
    const api_key = useSettingsStore.getState().api_key;

    const response = await axios.post<{ url: string }>(
        `${API_URL}/api/upload/`,
        null,
        {
            params: {
                url,
            },
            headers: {
                'api-key': api_key,
            },
        }
    );

    return response.data;
}
