import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Place, Tag } from '@/interfaces/place.interface';
import { fetchPlaces, updatePlace } from '@/api/places.api';
import { fetchTags } from '@/api/tags.api';

export default function Dashboard() {
  const [places, setPlaces] = useState<Place[]>([]);

  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetchPlaces().then((x) => {
      if (x) setPlaces(x);
    });

    fetchTags().then((x) => {
      if (x) setTags(x);
    });
  }, []);

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handlePlaceSelect = useCallback((place: Place) => {
    setSelectedPlace({ ...place });
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (selectedPlace) {
        setSelectedPlace({ ...selectedPlace, [e.target.name]: e.target.value });
      }
    },
    [selectedPlace]
  );

  const handleTagChange = useCallback(
    (selectedTags: Tag[]) => {
      if (selectedPlace) {
        const newTags = tags.filter((tag) => selectedTags.includes(tag));
        setSelectedPlace({ ...selectedPlace, tags: newTags });
      }
    },
    [selectedPlace, tags]
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
    }
  }, [selectedPlace, places]);

  return (
    <div>
      <h1 className='text-left text-3xl font-bold mb-4'>Places Dashboard</h1>
      <div className='h-fit grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='flex flex-col max-h-[85vh]'>
          <CardHeader>
            <CardTitle>Places</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-[75vh]'>
              {places.map((place) => (
                <Button
                  key={place.id}
                  onClick={() => handlePlaceSelect(place)}
                  variant={
                    selectedPlace?.id === place.id ? 'default' : 'outline'
                  }
                  className='w-full mb-2 justify-start'
                >
                  {place.title}
                </Button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className='col-span-3 max-h-[85vh] overflow-scroll'>
          <CardHeader>
            <CardTitle>Edit Place</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPlace ? (
              <div className='flex gap-8 flex-col'>
                <div className='h-64 flex gap-4 w-full overflow-scroll'>
                  {selectedPlace.image.map((x, index) => (
                    <img
                      key={`${selectedPlace.id}_${index}_image`}
                      className='border h-full aspect-[100/150] object-cover rounded-xl'
                      src={x}
                      alt=''
                    />
                  ))}
                </div>
                <form className='space-y-4 text-left w-full'>
                  <div className='flex gap-8'>
                    <div className='w-full'>
                      <Label htmlFor='title'>Title</Label>
                      <Input
                        id='title'
                        name='title'
                        value={selectedPlace.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='w-full'>
                      <Label htmlFor='address'>Address</Label>
                      <Input
                        id='address'
                        name='address'
                        value={selectedPlace.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor='description'>Description</Label>
                    <Textarea
                      id='description'
                      name='description'
                      value={selectedPlace.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor='tags'>Tags</Label>
                    <div className='flex py-2 gap-2'>
                      {tags.map((x, index) => {
                        return (
                          <div
                            onClick={() => {
                              if (selectedPlace.tags.includes(x)) {
                                handleTagChange([
                                  ...selectedPlace.tags.filter(
                                    (y) => y.id !== x.id
                                  ),
                                ]);
                              } else {
                                handleTagChange([...selectedPlace.tags, x]);
                              }
                            }}
                            key={`${selectedPlace.id}_${index}_tag_${x.id}`}
                            className={`${
                              selectedPlace.tags.find((y) => y.id == x.id)
                                ? 'bg-black text-white'
                                : ''
                            } cursor-pointer px-2 py-1 border rounded-lg`}
                          >
                            {x.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <p>Select a place to edit</p>
            )}
          </CardContent>
          <CardFooter className='justify-end'>
            <Button onClick={handleSave} disabled={!selectedPlace}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
