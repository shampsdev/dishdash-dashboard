import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchPlaces, fetchPlaceById, createPlace, updatePlace, deletePlace } from '../services/api';
import type { Place, PlaceFilter, PlacePatch } from '../types/place';
import PlaceForm from '../components/places/PlaceForm';

const PlacesPage: React.FC = () => {
  const { token } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  // Mobile view state to toggle between list and form
  const [showForm, setShowForm] = useState(false);
  const [filter] = useState<PlaceFilter>({});
  
  // Refs для неуправляемых инпутов
  const searchTermRef = useRef<HTMLInputElement>(null);
  const searchByIdRef = useRef<HTMLInputElement>(null);
  
  // Фильтры для отображения
  const [searchFilters, setSearchFilters] = useState<{ term: string, id: string }>({
    term: '',
    id: ''
  });

  useEffect(() => {
    loadPlaces();
  }, [token]);

  // Функция для применения фильтров
  const applyFilters = () => {
    const term = searchTermRef.current?.value || '';
    const id = searchByIdRef.current?.value || '';
    
    setSearchFilters({ term, id });
    
    // Фильтруем места
    let result = [...places];
    
    // Фильтр по имени/адресу
    if (term.trim()) {
      const termLower = term.toLowerCase();
      result = result.filter(place => 
        place.title.toLowerCase().includes(termLower) || 
        place.address.toLowerCase().includes(termLower)
      );
    }
    
    // Фильтр по ID
    if (id.trim()) {
      const idNumber = parseInt(id);
      if (!isNaN(idNumber)) {
        result = result.filter(place => place.id === idNumber);
      }
    }
    
    setFilteredPlaces(result);
  };

  // Функция для сброса фильтров
  const clearFilters = () => {
    if (searchTermRef.current) searchTermRef.current.value = '';
    if (searchByIdRef.current) searchByIdRef.current.value = '';
    setSearchFilters({ term: '', id: '' });
    setFilteredPlaces(places);
  };

  const loadPlaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const placesData = await fetchPlaces(filter);
      const placesArray = Array.isArray(placesData) ? placesData.flat() : [];
      setPlaces(placesArray);
      setFilteredPlaces(placesArray);
    } catch (err) {
      console.error('Error loading places:', err);
      setError('Failed to load places. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlace = async (placeData: Place | PlacePatch) => {
    try {
      // Ensure we're using a complete Place object for creation
      if ('priceAvg' in placeData) {
        await createPlace(placeData as Place);
      } else {
        console.error('Cannot create place: incomplete data');
        setError('Cannot create place: incomplete data');
        return;
      }
      await loadPlaces();
      setIsCreating(false);
      // Return to list view on mobile after creating
      setShowForm(false);
    } catch (err) {
      console.error('Error creating place:', err);
      setError('Failed to create place. Please try again.');
    }
  };

  const handleUpdatePlace = async (placeData: PlacePatch) => {
    try {
      await updatePlace(placeData);
      await loadPlaces();
      // Keep the place selected after update, but refresh the selection
      if (selectedPlace && selectedPlace.id) {
        const updatedPlace = await fetchPlaceById(selectedPlace.id);
        setSelectedPlace(updatedPlace);
      }
      // Return to list view on mobile after updating
      setShowForm(false);
    } catch (err) {
      console.error('Error updating place:', err);
      setError('Failed to update place. Please try again.');
    }
  };

  const handleDeletePlace = async (id: number) => {
    try {
      await deletePlace(id);
      await loadPlaces();
      if (selectedPlace?.id === id) {
        setSelectedPlace(null);
      }
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting place:', err);
      setError('Failed to delete place. Please try again.');
    }
  };

  const startCreating = () => {
    setSelectedPlace(null);
    setIsCreating(true);
    // Show form view on mobile when creating
    setShowForm(true);
  };

  const selectPlace = (place: Place) => {
    setSelectedPlace(place);
    setIsCreating(false);
    // Show form view on mobile when selecting a place
    setShowForm(true);
  };

  const cancelForm = () => {
    if (isCreating) {
      setIsCreating(false);
    }
    // Return to list view on mobile after canceling
    setShowForm(false);
  };

  // Back button for mobile view
  const handleBackToList = () => {
    setShowForm(false);
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <svg
        className="w-16 h-16 text-gray-500 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-white mb-2">No Place Selected</h3>
      <p className="text-gray-400 mb-6">Select a place from the list to edit or create a new one.</p>
      <button
        onClick={startCreating}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Create New Place
      </button>
    </div>
  );

  // Place list component
  const PlaceListWrapper = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Places</h2>
        <button
          onClick={startCreating}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Create
        </button>
      </div>
      
      {/* Search filters */}
      <div className="p-3 bg-gray-750 border-b border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="searchTerm" className="block text-xs font-medium text-gray-400 mb-1">
              Search by Name/Address
            </label>
            <input
              type="text"
              id="searchTerm"
              ref={searchTermRef}
              defaultValue={searchFilters.term}
              placeholder="Search places..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilters();
                }
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="searchById" className="block text-xs font-medium text-gray-400 mb-1">
              Search by ID
            </label>
            <input
              type="number"
              id="searchById"
              ref={searchByIdRef}
              defaultValue={searchFilters.id}
              placeholder="Place ID"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilters();
                }
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={clearFilters}
              className="text-xs text-gray-400 hover:text-white flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </button>
            <button
              onClick={applyFilters}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Apply filters
            </button>
          </div>
          <span className="text-xs text-gray-400">
            {filteredPlaces.length} of {places.length} places
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-blue-500 border-blue-500 border-opacity-25"></div>
            <p className="mt-2 text-gray-300">Loading places...</p>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">
              {places.length === 0 ? 'No places found' : 'No places match your search filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => selectPlace(place)}
                className={`p-3 rounded-md cursor-pointer transition-colors flex items-center ${
                  selectedPlace?.id === place.id
                    ? 'bg-blue-900/30 border border-blue-500/50'
                    : 'bg-gray-700 hover:bg-gray-600 border border-transparent'
                }`}
              >
                {place.images && place.images.length > 0 && (
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-600 flex-shrink-0 mr-3">
                    <img 
                      src={place.images[0]} 
                      alt={place.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite error loop
                        target.src = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"%3e%3crect width="40" height="40" fill="%234B5563"/%3e%3cpath d="M20 18C21.1046 18 22 17.1046 22 16C22 14.8954 21.1046 14 20 14C18.8954 14 18 14.8954 18 16C18 17.1046 18.8954 18 20 18Z" fill="%236B7280"/%3e%3cpath d="M14 26L18 22L20 24L24 20L26 22V26H14Z" fill="%236B7280"/%3e%3c/svg%3e';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{place.title}</p>
                  <div className="flex space-x-2 text-xs mt-1">
                    <span className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full">
                      ID: {place.id}
                    </span>
                    <span className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full">
                      {place.address || 'No address'}
                    </span>
                    {place.reviewRating > 0 && (
                      <span className="bg-yellow-900/30 text-yellow-400 px-2 py-0.5 rounded-full">
                        ★ {place.reviewRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                {deleteConfirmation === place.id && (
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (place.id) {
                          handleDeletePlace(place.id);
                        }
                      }}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Yes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmation(null);
                      }}
                      className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                    >
                      No
                    </button>
                  </div>
                )}
                {deleteConfirmation !== place.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (place.id) {
                        setDeleteConfirmation(place.id);
                      }
                    }}
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Form container component
  const FormContainer = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">
          {isCreating ? 'Create Place' : selectedPlace ? 'Edit Place' : 'Place Details'}
        </h2>
        {/* Back button for mobile view */}
        <button
          onClick={handleBackToList}
          className="md:hidden px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-500"
        >
          Back to List
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        {isCreating ? (
          <PlaceForm
            onSubmit={handleCreatePlace}
            onCancel={cancelForm}
            isCreating={true}
          />
        ) : selectedPlace ? (
          <PlaceForm
            place={selectedPlace}
            onSubmit={handleUpdatePlace}
            onCancel={cancelForm}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
      <h1 className="text-2xl font-bold text-white mb-4">Places Dashboard</h1>
      
      {/* Desktop view - Side by side */}
      <div className="hidden md:flex space-x-4 flex-1 overflow-hidden">
        <div className="w-1/3 overflow-hidden">
          <PlaceListWrapper />
        </div>
        <div className="w-2/3 overflow-hidden">
          <FormContainer />
        </div>
      </div>
      
      {/* Mobile view - Toggle between list and form */}
      <div className="md:hidden flex flex-col flex-1 overflow-hidden">
        {showForm ? <FormContainer /> : <PlaceListWrapper />}
      </div>
    </div>
  );
};

export default PlacesPage; 