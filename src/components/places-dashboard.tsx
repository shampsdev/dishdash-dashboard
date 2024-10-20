'use client'

import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Tag {
  icon: string
  id: number
  name: string
}

interface Location {
  lat: number
  lon: number
}

interface Place {
  address: string
  description: string
  id: number
  image: string[]
  location: Location
  priceAvg: number
  reviewCount: number
  reviewRating: number
  shortDescription: string
  tags: Tag[]
  title: string
  updatedAt: string
}

export function PlacesDashboardComponent() {
  const [places, setPlaces] = useState<Place[]>([
    {
      id: 1,
      title: "Sample Place",
      address: "123 Main St, City, Country",
      description: "A lovely sample place",
      shortDescription: "Lovely sample",
      image: ["/placeholder.svg"],
      location: { lat: 0, lon: 0 },
      priceAvg: 50,
      reviewCount: 10,
      reviewRating: 4.5,
      tags: [],
      updatedAt: new Date().toISOString(),
    },
  ])

  const [tags, setTags] = useState<Tag[]>([
    { id: 1, name: "Restaurant", icon: "🍽️" },
    { id: 2, name: "Hotel", icon: "🏨" },
    { id: 3, name: "Attraction", icon: "🎭" },
  ])

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  const handlePlaceSelect = useCallback((place: Place) => {
    setSelectedPlace({ ...place })
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (selectedPlace) {
      setSelectedPlace({ ...selectedPlace, [e.target.name]: e.target.value })
    }
  }, [selectedPlace])

  const handleTagChange = useCallback((selectedTagIds: string[]) => {
    if (selectedPlace) {
      const newTags = tags.filter(tag => selectedTagIds.includes(tag.id.toString()))
      setSelectedPlace({ ...selectedPlace, tags: newTags })
    }
  }, [selectedPlace, tags])

  const handleSave = useCallback(() => {
    if (selectedPlace) {
      setPlaces(places.map(place => place.id === selectedPlace.id ? selectedPlace : place))
      setSelectedPlace(null)
    }
  }, [selectedPlace, places])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Places Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Places</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {places.map(place => (
                <Button
                  key={place.id}
                  onClick={() => handlePlaceSelect(place)}
                  variant={selectedPlace?.id === place.id ? "default" : "outline"}
                  className="w-full mb-2 justify-start"
                >
                  {place.title}
                </Button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Edit Place</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPlace ? (
              <form className="space-y-4">
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
                  <Select
                    onValueChange={handleTagChange}
                    defaultValue={selectedPlace.tags.map(tag => tag.id.toString())}
                    multiple
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select tags" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map(tag => (
                        <SelectItem key={tag.id} value={tag.id.toString()}>
                          {tag.icon} {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </form>
            ) : (
              <p>Select a place to edit</p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={!selectedPlace}>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}