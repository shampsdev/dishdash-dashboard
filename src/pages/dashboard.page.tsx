import React, { useState, useCallback, useEffect } from 'react';
import { Place, Tag } from '@/interfaces/place.interface';
import { fetchPlaces, updatePlace } from '@/api/places.api';
import { fetchTags } from '@/api/tags.api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TagComponent } from '@/components/tag';

export default function DashboardPage() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchPlaces().then((x) => {
            if (x) setPlaces(x);
        });

        fetchTags().then((x) => {
            if (x) setTags(x);
        });
    }, []);

    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    useEffect(() => {
        console.log(selectedPlace);
    }, [selectedPlace])

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (selectedPlace) {
                setSelectedPlace({ ...selectedPlace, [e.target.name]: e.target.value });
            }
        },
        [selectedPlace]
    );

    const handleTagChange =
        (selectedTags: Tag[]) => {
            console.log(selectedTags);
            if (selectedPlace) {
                const newTags = tags.filter((tag) => selectedTags.includes(tag));
                setSelectedPlace({ ...selectedPlace, tags: newTags });
            }
        }

    const handleSave = useCallback(() => {
        if (selectedPlace) {
            setPlaces(
                places.map((place) =>
                    place.id === selectedPlace.id ? selectedPlace : place
                )
            );
            updatePlace(selectedPlace);
            setSelectedPlace(null);
        }
    }, [selectedPlace, places]);

    const filteredPlaces = places.filter((place) =>
        place.title.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="w-full h-full flex">
            <div className="flex flex-col w-[400px] border-gray-100 border-r">
                <div className="p-5 pt-4 space-y-5 border-gray-100 border-b">
                    <h1 className="text-xl">All Places</h1>
                    <Input
                        placeholder="Filter places..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className='h-full divide-gray-100 w-fit overflow-y-scroll'>
                    {filteredPlaces.map((x, index) => (
                        <div key={`${x.id}_${index}`} onClick={() => setSelectedPlace(x)} className="cursor-pointer px-3 py-2 h-24 hover:bg-gray-100 w-full">
                            <p>
                                {x.title}
                            </p>
                            <p className="text-muted-foreground line-clamp-2 text-sm">
                                {x.address}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full p-5">
                {selectedPlace ? (
                    <form className="space-y-4">
                        <div className="aspect-square h-[300px]">
                            <img className="h-full w-full object-cover" src={selectedPlace.image[0]} />
                        </div>
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
                                id="description"
                                name="description"
                                value={selectedPlace.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="tags">Tags</Label>
                            <div className="flex pt-2 divide-black">
                                <div className="flex gap-5 border-r pr-5 border-r-gray-300">
                                    {selectedPlace.tags.map((tag, index) => (
                                        <TagComponent key={`${tag.id}_${index}_tag`} onClick={() => {
                                            handleTagChange(selectedPlace.tags.filter(x => x.id != tag.id))
                                        }} tag={tag} />
                                    ))}
                                </div>
                                <div className="flex gap-5 pl-5">
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

                        <Button onClick={handleSave}>Save</Button>
                    </form>
                ) : (
                    <p>Select a place to edit</p>
                )}
            </div>
        </div>
    );
}
