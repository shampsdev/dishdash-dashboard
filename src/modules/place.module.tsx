import { useCallback, useEffect, useState } from "react";

import { Place, Tag } from "@/interfaces/place.interface";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagComponent } from "@/components/tag";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/shared/stores/places.store";

export const PlaceModule = ({
  inputPlace,
  onSave,
}: {
  inputPlace: Place;
  onSave: (place: Place) => void;
}) => {
  const [place, setPlace] = useState<Place>(inputPlace);

  useEffect(() => {
    setPlace(inputPlace);
  }, [inputPlace]);

  const { tags } = useDashboardStore();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (!place) return;

      if (name === "lat" || name === "lon") {
        const newLocation = {
          ...place.location,
          [name]: value,
        };
        setPlace({ ...place, location: newLocation });
      } else {
        setPlace({ ...place, [name]: value });
      }
    },
    [place]
  );

  const handleAddPhoto = () => {
    if (!place) return;
    const newPhotoUrl = prompt("Enter the URL of the new photo:");
    if (newPhotoUrl) {
      setPlace({
        ...place,
        images: [...place.images, newPhotoUrl],
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    if (!place) return;
    const newImages = place.images.filter((_, i) => i !== index);
    setPlace({ ...place, images: newImages });
  };

  const toggleTag = (tag: Tag) => {
    const isTagSelected = place.tags.some((t) => t.id === tag.id);
    const updatedTags = isTagSelected
      ? place.tags.filter((t) => t.id !== tag.id)
      : [...place.tags, tag];
    handleTagChange(updatedTags);
  };

  const handleTagChange = (updatedTags: Tag[]) => {
    setPlace((prev) => ({
      ...prev,
      tags: updatedTags,
    }));
  };

  const handleSave = useCallback(() => {
    place.location.lat = Number(place.location.lat);
    place.location.lon = Number(place.location.lon);

    place.priceAvg = Number(place.priceAvg);

    onSave(place);
  }, [place, onSave]);

  return place !== null ? (
    <form className="flex gap-5 flex-col h-full">
      <div className="w-full h-[600px] overflow-x-scroll overflow-y-hidden">
        <div className="whitespace-nowrap h-fit space-x-5 text-gray-300">
          {place.images.map((img, index) => (
            <div
              key={`${index}_picture`}
              className="inline-block group aspect-[21/30] bg-gray-100 relative rounded-xl overflow-hidden h-[300px]"
            >
              <img
                className="h-full w-full object-cover"
                src={img}
                alt="Place"
              />
              <div
                className="cursor-pointer h-6 w-6 p-1 group-hover:flex hidden justify-center items-center absolute bottom-2 right-2 bg-gray-100 rounded-full"
                onClick={() => handleRemovePhoto(index)}
              >
                <X />
              </div>
            </div>
          ))}
          <div
            className="inline-block bg-gray-100 rounded-xl overflow-hidden h-[300px] cursor-pointer"
            onClick={handleAddPhoto}
          >
            <div className="flex items-center justify-center h-full w-full aspect-[21/30]">
              <Plus />
            </div>
          </div>
        </div>
      </div>
      <div className="h-full pl-1 w-full space-y-4 overflow-scroll">
        <div className="flex gap-5">
          <div className="w-full space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={place.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={place.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                maxLength={300}
                id="description"
                name="description"
                value={place.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Location (lat / lon)</Label>
              <div className="flex gap-5 w-full items-end">
                <div>
                  <Input
                    id="lat"
                    name="lat"
                    value={place.location.lat}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Input
                    id="lon"
                    name="lon"
                    value={place.location.lon}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="priceAvg">Avg Price</Label>
              <Input
                id="priceAvg"
                name="priceAvg"
                className="w-[100px]"
                value={place.priceAvg}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="tags">Tags</Label>
          <div className="flex pt-2 divide-black">
            <div className="flex flex-wrap gap-5 border-r pr-5 border-r-gray-300">
              {place.tags.map((tag, index) => (
                <TagComponent
                  key={`${tag.id}_${index}_tag`}
                  onClick={() => {
                    toggleTag(tag);
                  }}
                  tag={tag}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-5 pl-5">
              {tags
                .filter((x) => !place.tags.flatMap((y) => y.id).includes(x.id))
                .map((tag, index) => (
                  <TagComponent
                    key={`${tag.id}_${index}_tag`}
                    onClick={() => {
                      toggleTag(tag);
                    }}
                    tag={tag}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="button" onClick={handleSave}>
          Save
        </Button>
      </div>
    </form>
  ) : (
    <></>
  );
};
