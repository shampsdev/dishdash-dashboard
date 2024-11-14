import { Place, Tag } from "@/interfaces/place.interface";
import { create } from "zustand";

interface DashboardState {
    places: Place[];
    tags: Tag[];
    setPlaces: (places: Place[]) => void;
    setTags: (tags: Tag[]) => void;
}

export const useDashboardStore = create<DashboardState>()(
    (set) => ({
        places: [],
        tags: [],
        setPlaces: (places: Place[]) => set({ places }),
        setTags: (tags: Tag[]) => set({ tags })
    }),
)
