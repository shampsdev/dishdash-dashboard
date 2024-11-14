import { useParams } from "react-router-dom";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { TagComponent } from "./tag";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { useDashboardStore } from "@/shared/places.store";

import { Place, Tag } from "@/interfaces/place.interface";
import { updatePlace } from "@/api/places.api";
import toast from "react-hot-toast";

export const PlaceModule = () => {
    const { id } = useParams<{ id: string }>(); //placeId
    const { places, tags, setPlaces } = useDashboardStore();

    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    useEffect(() => {
        setSelectedPlace(places.find(x => x.id.toString() == id) ?? null)
    }, [id, places])

    const handleTagChange =
        (selectedTags: Tag[]) => {
            console.log(selectedTags);
            if (selectedPlace) {
                const newTags = tags.filter((tag) => selectedTags.includes(tag));
                setSelectedPlace({ ...selectedPlace, tags: newTags });
            }
        }

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;

            if (!selectedPlace) return;

            // Check if the input is for location (latitude or longitude)
            if (name === "lat" || name === "lon") {
                const newLocation = {
                    ...selectedPlace.location,
                    [name]: value,
                };
                setSelectedPlace({ ...selectedPlace, location: newLocation });
            } else {
                setSelectedPlace({ ...selectedPlace, [name]: value });
            }
        },
        [selectedPlace]
    );


    const handleSave = useCallback(() => {
        if (selectedPlace) {
            setPlaces(
                places.map((place) =>
                    place.id === selectedPlace.id ? selectedPlace : place
                )
            );
            updatePlace(selectedPlace);
            setSelectedPlace(null);
            toast.success('обновили место')
        }
    }, [selectedPlace, places, setPlaces]);

    return (selectedPlace !== null ?
        <form className="flex flex-col h-full">
            <div className="h-full pl-1 w-full space-y-4 overflow-scroll">
                <div className="flex gap-5">
                    <div className="w-full space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={selectedPlace.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                value={selectedPlace.address}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                maxLength={300}
                                id="description"
                                name="description"
                                value={selectedPlace.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <div className="flex gap-5 w-full items-end">
                                <div>
                                    <Label htmlFor="lat">Latitude</Label>
                                    <Input
                                        id="lat"
                                        name="lat"
                                        value={selectedPlace.location.lat}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lon">Longitude</Label>
                                    <Input
                                        id="lon"
                                        name="lon"
                                        value={selectedPlace.location.lon}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex gap-5 w-full items-end">
                                    <Button variant={'outline'}>Edit Picture</Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="priceAvg">Avg Price</Label>
                            <Input
                                id="priceAvg"
                                name="priceAvg"
                                className="w-[100px]"
                                value={selectedPlace.priceAvg}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="aspect-square h-[350px] space-y-5">
                        <img className="h-full w-full object-cover" src={selectedPlace.image[0]} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex pt-2 divide-black">
                        <div className="flex flex-wrap gap-5 border-r pr-5 border-r-gray-300">
                            {selectedPlace.tags.map((tag, index) => (
                                <TagComponent key={`${tag.id}_${index}_tag`} onClick={() => {
                                    handleTagChange(selectedPlace.tags.filter(x => x.id != tag.id))
                                }} tag={tag} />
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-5 pl-5">
                            {tags
                                .filter(x =>
                                    !selectedPlace.tags
                                        .flatMap(y => y.id)
                                        .includes(x.id))
                                .map((tag, index) => (
                                    <TagComponent key={`${tag.id}_${index}_tag`} onClick={() => {
                                        handleTagChange([tag, ...selectedPlace.tags])
                                    }} tag={tag} />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <Button onClick={handleSave}>Save</Button>
            </div>
        </form>
        :
        <></>
    )
}
