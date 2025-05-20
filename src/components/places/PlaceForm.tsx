import React, { useState, useEffect, useRef } from 'react';
import type { Place, PlacePatch } from '../../types/place';
import TagsMultiSelect from '../tags/TagsMultiSelect';
import { uploadImageByUrl, uploadImageByFile, updatePlace } from '../../services/api';

interface PlaceFormProps {  
  place?: Place | null;  
  onSubmit: (placeData: Place | PlacePatch) => Promise<Place | null>;  
  onCancel: () => void;  
  isCreating?: boolean;
}

const PlaceForm: React.FC<PlaceFormProps> = ({ place, onSubmit, onCancel, isCreating = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('api');
  const [images, setImages] = useState<string[]>([]);
  // Image files to upload after place creation/update
  const [pendingImageUrls, setPendingImageUrls] = useState<string[]>([]);
  const [pendingImageFiles, setPendingImageFiles] = useState<File[]>([]);
  
  // Use string state for numeric inputs to allow empty inputs during editing
  const [location, setLocation] = useState<{lat: string; lon: string}>({ lat: '0', lon: '0' });
  const [priceAvg, setPriceAvg] = useState('');
  const [boost, setBoost] = useState('');
  const [boostRadius, setBoostRadius] = useState('');
  const [tags, setTags] = useState<number[]>([]);
  
  // Image upload states
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form with place data if editing
  useEffect(() => {
    if (place) {
      setTitle(place.title || '');
      setDescription(place.description || '');
      setAddress(place.address || '');
      setUrl(place.url || '');
      setSource(place.source || 'api');
      setImages(place.images || []);
      setLocation({
        lat: place.location?.lat?.toString() || '0',
        lon: place.location?.lon?.toString() || '0'
      });
      setPriceAvg(place.priceAvg?.toString() || '');
      setBoost(place.boost?.toString() || '');
      setBoostRadius(place.boostRadius?.toString() || '');
      
      // Ensure tags are properly converted to an array of numbers
      setTags(Array.isArray(place.tags) 
        ? place.tags.map(tag => 
            typeof tag === 'object' && tag !== null && 'id' in tag 
              ? (tag as {id: number}).id 
              : Number(tag)
          )
        : []);
    } else {
      // Reset form if creating a new place
      setTitle('');
      setDescription('');
      setAddress('');
      setUrl('');
      setSource('api');
      setImages([]);
      setLocation({ lat: '', lon: '' });
      setPriceAvg('');
      setBoost('');
      setBoostRadius('');
      setTags([]);
    }
    
    // Clear pending images
    setPendingImageUrls([]);
    setPendingImageFiles([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert string values to numbers for submission
      const placeData: Place | PlacePatch = {
        title,
        description,
        address,
        url,
        source,
        images, // Existing images only, new ones will be uploaded after place creation
        location: {
          lat: parseFloat(location.lat) || 0,
          lon: parseFloat(location.lon) || 0
        },
        priceAvg: parseInt(priceAvg) || 0,
        boost: parseFloat(boost) || 0,
        boostRadius: parseFloat(boostRadius) || 0,
        tags
      };

      // Add ID if editing
      if (place?.id) {
        placeData.id = place.id;
      }

      // First create/update the place
      const savedPlace = await onSubmit(placeData);
      
      if (savedPlace && savedPlace.id) {
        // Now upload all pending images with the place ID
        const newImageUrls: string[] = [];
        
        // Upload pending URL images
        if (pendingImageUrls.length > 0) {
          setUploadProgress(10);
          for (let i = 0; i < pendingImageUrls.length; i++) {
            const imageUrl = pendingImageUrls[i];
            const uploadedUrl = await uploadImageByUrl(imageUrl, savedPlace.id);
            newImageUrls.push(uploadedUrl);
            setUploadProgress(10 + Math.floor((i + 1) / pendingImageUrls.length * 40));
          }
        }
        
        // Upload pending file images
        if (pendingImageFiles.length > 0) {
          setUploadProgress(50);
          for (let i = 0; i < pendingImageFiles.length; i++) {
            const file = pendingImageFiles[i];
            const uploadedUrl = await uploadImageByFile(file, savedPlace.id);
            newImageUrls.push(uploadedUrl);
            setUploadProgress(50 + Math.floor((i + 1) / pendingImageFiles.length * 40));
          }
        }
        
        // If we have new images, update the place with them
        if (newImageUrls.length > 0) {
          setUploadProgress(90);
          const allImages = [...images, ...newImageUrls];
          
          // Update place with new images
          await updatePlace({
            id: savedPlace.id,
            images: allImages
          });
          
          // Update local state
          setImages(allImages);
          setPendingImageUrls([]);
          setPendingImageFiles([]);
        }
        
        setUploadProgress(100);
      }
    } catch (error) {
      console.error('Error saving place or uploading images:', error);
      setErrors({...errors, submit: 'Failed to save place or upload images. Please try again.'});
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAddPendingImageUrl = () => {
    if (!newImageUrl.trim()) return;
    
    // Add to pending URLs list
    setPendingImageUrls([...pendingImageUrls, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleAddPendingImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Add to pending files list
    setPendingImageFiles([...pendingImageFiles, files[0]]);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleRemovePendingUrl = (index: number) => {
    setPendingImageUrls(pendingImageUrls.filter((_, i) => i !== index));
  };

  const handleRemovePendingFile = (index: number) => {
    setPendingImageFiles(pendingImageFiles.filter((_, i) => i !== index));
  };

  const handleLocationChange = (field: keyof typeof location, value: string) => {
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
                  onChange={(e) => handleLocationChange('lat', e.target.value)}
                  className="block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="lon" className="block text-xs text-gray-400">Longitude</label>
                <input
                  type="number"
                  id="lon"
                  step="any"
                  value={location.lon}
                  onChange={(e) => handleLocationChange('lon', e.target.value)}
                  className="block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
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
              value={priceAvg}
              onChange={(e) => setPriceAvg(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>
        
        {/* Right column - Details and Images */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-white">Details & Images</h3>
          
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
                step="0.1"
                value={boost}
                onChange={(e) => setBoost(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="boostRadius" className="block text-sm font-medium text-gray-300">
                Boost Radius
              </label>
              <input
                type="number"
                id="boostRadius"
                value={boostRadius}
                onChange={(e) => setBoostRadius(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Images
            </label>
            
            {errors.submit && (
              <p className="mb-2 text-sm text-red-500">{errors.submit}</p>
            )}
            
            {/* URL Image Upload */}
            <div className="flex space-x-2 mb-3">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              />
              <button
                type="button"
                onClick={handleAddPendingImageUrl}
                className={`px-3 py-2 ${isUploading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                disabled={isUploading || !newImageUrl.trim()}
              >
                Add URL
              </button>
            </div>
            
            {/* File Upload */}
            <div className="flex space-x-2 mb-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAddPendingImageFile}
                accept="image/*"
                className="flex-1 rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-2 file:py-1 file:px-3 file:border-0 file:rounded-md file:bg-blue-600 file:text-white file:cursor-pointer"
                disabled={isUploading}
              />
            </div>
            
            {/* Upload Progress Indicator - only shown during form submission */}
            {isUploading && (
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-3">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            
            {/* Pending Images */}
            {(pendingImageUrls.length > 0 || pendingImageFiles.length > 0) && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">New Images (will be uploaded when saved)</h4>
                <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto custom-scrollbar p-1">
                  {pendingImageUrls.map((url, index) => (
                    <div key={`url-${index}`} className="relative group rounded-md overflow-hidden bg-gray-700 p-2">
                      <p className="text-xs text-gray-300 truncate">{url}</p>
                      <button
                        type="button"
                        onClick={() => handleRemovePendingUrl(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {pendingImageFiles.map((file, index) => (
                    <div key={`file-${index}`} className="relative group rounded-md overflow-hidden bg-gray-700 p-2">
                      <p className="text-xs text-gray-300 truncate">{file.name}</p>
                      <button
                        type="button"
                        onClick={() => handleRemovePendingFile(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Existing Images Gallery */}
            <h4 className="text-sm font-medium text-gray-300 mb-2">Existing Images</h4>
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
                <p className="text-gray-400 text-sm">No images yet</p>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
              Tags
            </label>
            <div className="mt-1 relative">
              <TagsMultiSelect
                selectedTags={tags}
                onChange={setTags}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-3 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled={isUploading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isUploading}
        >
          {isUploading ? 'Saving...' : (isCreating ? 'Create' : 'Update')}
        </button>
      </div>
    </form>
  );
};

export default PlaceForm; 