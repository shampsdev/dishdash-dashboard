import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Place } from '@/interfaces/place.interface';
import {
  deletePlace,
  fetchPlaces,
  savePlace,
  updatePlace,
} from '../api/places.api';

export const usePlaces = () => {
  const queryClient = useQueryClient();

  const fetchPlacesQuery = useQuery<Place[], Error>({
    queryKey: ['places'],
    queryFn: fetchPlaces,
  });

  const updatePlaceMutation = useMutation<Place, Error, Place>({
    mutationFn: updatePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });

  const savePlaceMutation = useMutation<Place, Error, Place>({
    mutationFn: savePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });

  const deletePlaceMutation = useMutation<Place, Error, Place>({
    mutationFn: deletePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });

  return {
    ...fetchPlacesQuery,
    savePlace: savePlaceMutation,
    updatePlace: updatePlaceMutation.mutate,
    deletePlace: deletePlaceMutation.mutate,
    isUpdating: updatePlaceMutation.isPending || savePlaceMutation.isPending,
  };
};
