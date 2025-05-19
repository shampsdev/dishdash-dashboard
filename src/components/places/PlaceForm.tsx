import React, { useState, useEffect } from 'react';
import type { Place, PlacePatch, Coordinate } from '../../types/place';

interface PlaceFormProps {
  place?: Place | null;
  onSubmit: (placeData: Place | PlacePatch) => void | Promise<void>;
  onCancel: () => void;
  isCreating?: boolean;
}

const defaultLocation: Coordinate = {
  lat: 0,
  lon: 0
};

const PlaceForm: React.FC<PlaceFormProps> = ({ place, onSubmit, onCancel, isCreating = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [address, setAddress] = useState('');
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState<Coordinate>(defaultLocation);
  const [priceAvg, setPriceAvg] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [boost, setBoost] = useState(0);
  const [boostRadius, setBoostRadius] = useState(0);
  const [tags, setTags] = useState<number[]>([]);
  
  // New image URL input state
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form with place data if editing
  useEffect(() => {
    if (place) {
      setTitle(place.title || '');
      setDescription(place.description || '');
      setShortDescription(place.shortDescription || '');
      setAddress(place.address || '');
      setUrl(place.url || '');
      setSource(place.source || '');
      setImages(place.images || []);
      setLocation(place.location || defaultLocation);
      setPriceAvg(place.priceAvg || 0);
      setReviewRating(place.reviewRating || 0);
      setReviewCount(place.reviewCount || 0);
      setBoost(place.boost || 0);
      setBoostRadius(place.boostRadius || 0);
      setTags(place.tags || []);
    } else {
      // Reset form if creating a new place
      setTitle('');
      setDescription('');
      setShortDescription('');
      setAddress('');
      setUrl('');
      setSource('');
      setImages([]);
      setLocation(defaultLocation);
      setPriceAvg(0);
      setReviewRating(0);
      setReviewCount(0);
      setBoost(0);
      setBoostRadius(0);
      setTags([]);
    }
  }, [place]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!url.trim()) {
      newErrors.url = 'URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const placeData: Place | PlacePatch = {
      title,
      description,
      shortDescription,
      address,
      url,
      source,
      images,
      location,
      priceAvg,
      reviewRating,
      reviewCount,
      boost,
      boostRadius,
      tags
    };

    // Add ID if editing
    if (place?.id) {
      placeData.id = place.id;
    }

    onSubmit(placeData);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleLocationChange = (field: keyof Coordinate, value: number) => {
    setLocation({
      ...location,
      [field]: value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Basic Info */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-white">Basic Information</h3>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 block w-full rounded-md bg-gray-700 border ${
                errors.title ? 'border-red-500' : 'border-gray-600'
              } text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>
          
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-300">
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`mt-1 block w-full rounded-md bg-gray-700 border ${
                errors.url ? 'border-red-500' : 'border-gray-600'
              } text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="https://example.com"
            />
            {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url}</p>}
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Location
            </label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <div>
                <label htmlFor="lat" className="block text-xs text-gray-400">Latitude</label>
                <input
                  type="number"
                  id="lat"
                  step="any"
                  value={location.lat}
                  onChange={(e) => handleLocationChange('lat', parseFloat(e.target.value) || 0)}
                  className="block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lon" className="block text-xs text-gray-400">Longitude</label>
                <input
                  type="number"
                  id="lon"
                  step="any"
                  value={location.lon}
                  onChange={(e) => handleLocationChange('lon', parseFloat(e.target.value) || 0)}
                  className="block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-300">
              Source
            </label>
            <input
              type="text"
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="priceAvg" className="block text-sm font-medium text-gray-300">
              Average Price
            </label>
            <input
              type="number"
              id="priceAvg"
              min="0"
              value={priceAvg}
              onChange={(e) => setPriceAvg(parseInt(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="reviewRating" className="block text-sm font-medium text-gray-300">
                Review Rating
              </label>
              <input
                type="number"
                id="reviewRating"
                min="0"
                max="5"
                step="0.1"
                value={reviewRating}
                onChange={(e) => setReviewRating(parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="reviewCount" className="block text-sm font-medium text-gray-300">
                Review Count
              </label>
              <input
                type="number"
                id="reviewCount"
                min="0"
                value={reviewCount}
                onChange={(e) => setReviewCount(parseInt(e.target.value) || 0)}
                className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Right column - Details and Images */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-white">Details & Images</h3>
          
          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-300">
              Short Description
            </label>
            <input
              type="text"
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Full Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="boost" className="block text-sm font-medium text-gray-300">
                Boost
              </label>
              <input
                type="number"
                id="boost"
                min="0"
                step="0.1"
                value={boost}
                onChange={(e) => setBoost(parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="boostRadius" className="block text-sm font-medium text-gray-300">
                Boost Radius
              </label>
              <input
                type="number"
                id="boostRadius"
                min="0"
                value={boostRadius}
                onChange={(e) => setBoostRadius(parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Images
            </label>
            
            <div className="flex space-x-2 mb-3">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar p-1">
                {images.map((image, index) => (
                  <div key={index} className="relative group rounded-md overflow-hidden bg-gray-700">
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite error loop
                        target.src = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"%3e%3crect width="40" height="40" fill="%234B5563"/%3e%3cpath d="M20 18C21.1046 18 22 17.1046 22 16C22 14.8954 21.1046 14 20 14C18.8954 14 18 14.8954 18 16C18 17.1046 18.8954 18 20 18Z" fill="%236B7280"/%3e%3cpath d="M14 26L18 22L20 24L24 20L26 22V26H14Z" fill="%236B7280"/%3e%3c/svg%3e';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 bg-gray-700 rounded-md border border-gray-600 border-dashed">
                <p className="text-gray-400 text-sm">No images added</p>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
              Tags (Comma separated tag IDs)
            </label>
            <input
              type="text"
              id="tags"
              value={tags.join(', ')}
              onChange={(e) => {
                const inputStr = e.target.value;
                const newTags = inputStr
                  .split(',')
                  .map(tag => parseInt(tag.trim()))
                  .filter(tag => !isNaN(tag));
                setTags(newTags);
              }}
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1, 2, 3"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-3 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isCreating ? 'Create' : 'Update'}
        </button>
      </div>
    </form>
  );
};

export default PlaceForm; 