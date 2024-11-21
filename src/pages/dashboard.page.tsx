
import { useParams } from "react-router-dom";
import { PlaceModule } from "@/modules/place.module";
import { useEffect, useState } from "react";
import { Place } from "@/interfaces/place.interface";
import { usePlaces } from "@/shared/hooks/usePlaces";
import { updatePlace } from "@/shared/api/places.api";
import toast from "react-hot-toast";

export const DashboardPage = () => {
    const { id } = useParams<{ id: string }>(); //placeId
    const { data } = usePlaces();

    const [place, setPlace] = useState<Place | null>(null);

    useEffect(() => {
        setPlace(data?.find(x => x.id.toString() == id) ?? null);
    }, [id, data])

    const handleSave = (place: Place) => {
        updatePlace(place);
        toast.success("Place updated");
    }

    return (
        place !== null ? <PlaceModule onSave={handleSave} inputPlace={place} /> : <></>
    )
}
