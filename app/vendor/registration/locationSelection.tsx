'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadGoogleMapsScript, isGoogleMapsLoaded } from "../../lib/googleMaps";
import { toast } from "sonner";
import { Location } from "./types";
import { Libraries, StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import { GOOGLE_MAP_API_KEY } from "@/lib/apiConfigs";

const libraries: Libraries = ["places"];

// Add global interface declaration
declare global {
  interface Window {
    google?: any;
    mapInstance?: google.maps.Map & {
      markers?: google.maps.Marker[];
    } | null;
  }
}

interface PopupScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onLocationSubmit?: (locationData: Location) => Promise<void>;
}

export default function LocationPopupScreen({ open, setOpen, onLocationSubmit }: PopupScreenProps) {
  // State for form data
  const [formData, setFormData] = useState<Location>({
    id: '',
    address: '',
    road: '',
    area: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    latitude: '',
    longitude: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Track if form was submitted
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const [useGoogleMaps, setUseGoogleMaps] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [searchInput, setSearchInput] = useState('');

  // Initialize map
  const initializeMap = useCallback(() => {
    if (mapRef.current && window.google?.maps) {
      // Clear any existing map instance
      if (window.mapInstance) {
        window.mapInstance = null;
      }

      // Default to Mumbai if geolocation fails
      const defaultLocation = { lat: 19.0760, lng: 72.8777 };
      
      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            const mapOptions = {
              center: userLocation,
              zoom: 15,
            };

            const map = new window.google.maps.Map(mapRef.current, mapOptions);
            window.mapInstance = map; // Store map instance globally

            // Add a marker that can be dragged to set the location
            const marker = new window.google.maps.Marker({
              position: userLocation,
              map: map,
              draggable: true,
              title: "Drag to select location",
            });

            // Update form data when marker is dragged
            marker.addListener('dragend', () => {
              const position = marker.getPosition();
              if (position) {
                setFormData(prev => ({
                  ...prev,
                  latitude: position.lat().toString(),
                  longitude: position.lng().toString(),
                }));

                // Use reverse geocoding to fill address fields
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: position }, (results: google.maps.GeocoderResult[] | null, status: string) => {
                  if (status === 'OK' && results![0]) {
                    updateAddressFromGeocode(results![0]);
                  }
                });
              }
            });
          },
          (error) => {
            // If geolocation fails, use default location
            console.error('Error getting location:', error);
            toast.error('Unable to get your current location. Using default location.');
            
            const mapOptions = {
              center: defaultLocation,
              zoom: 15,
            };

            const map = new window.google.maps.Map(mapRef.current, mapOptions);
            window.mapInstance = map; // Store map instance globally

            // Add a marker that can be dragged to set the location
            const marker = new window.google.maps.Marker({
              position: defaultLocation,
              map: map,
              draggable: true,
              title: "Drag to select location",
            });

            // Update form data when marker is dragged
            marker.addListener('dragend', () => {
              const position = marker.getPosition();
              if (position) {
                setFormData(prev => ({
                  ...prev,
                  latitude: position.lat().toString(),
                  longitude: position.lng().toString(),
                }));

                // Use reverse geocoding to fill address fields
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: position }, (results: google.maps.GeocoderResult[] | null, status: string) => {
                  if (status === 'OK' && results![0]) {
                    updateAddressFromGeocode(results![0]);
                  }
                });
              }
            });
          }
        );
      } else {
        // If geolocation is not supported, use default location
        toast.error('Geolocation is not supported by your browser. Using default location.');
        
        const mapOptions = {
          center: defaultLocation,
          zoom: 15,
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);
        window.mapInstance = map; // Store map instance globally

        // Add a marker that can be dragged to set the location
        const marker = new window.google.maps.Marker({
          position: defaultLocation,
          map: map,
          draggable: true,
          title: "Drag to select location",
        });

        // Update form data when marker is dragged
        marker.addListener('dragend', () => {
          const position = marker.getPosition();
          if (position) {
            setFormData(prev => ({
              ...prev,
              latitude: position.lat().toString(),
              longitude: position.lng().toString(),
            }));

            // Use reverse geocoding to fill address fields
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: position }, (results: google.maps.GeocoderResult[] | null, status: string) => {
              if (status === 'OK' && results![0]) {
                updateAddressFromGeocode(results![0]);
              }
            });
          }
        });
      }
    }
  }, []);

  // Handle places changed event
  const handlePlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      setSelectedPlace(place);
      
      // Get the most specific location name available
      const locationName = place.formatted_address || place.name || "";
      setSearchInput(locationName);

      // Update form data with selected place details
      const geometry = place.geometry;
      const location = geometry?.location;
      if (geometry && location) {
        setFormData(prev => ({
          ...prev,
          latitude: location.lat().toString(),
          longitude: location.lng().toString(),
        }));

        // Update address fields
        if (place.address_components) {
          updateAddressFromGeocode(place);
        }
      }
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (selectedPlace && window.mapInstance) {
      const geometry = selectedPlace.geometry;
      const location = geometry?.location;
      
      // Validate coordinates
      if (geometry && location && 
          typeof location.lat === 'function' && 
          typeof location.lng === 'function') {
        
        const lat = location.lat();
        const lng = location.lng();
        
        // Check if coordinates are valid numbers
        if (isNaN(lat) || isNaN(lng) || 
            !isFinite(lat) || !isFinite(lng)) {
          console.error('Invalid coordinates:', { lat, lng });
          return;
        }

        // Create a valid LatLng object
        const validLocation = new window.google.maps.LatLng(lat, lng);
        
        // Update map center
        window.mapInstance.setCenter(validLocation);
        
        // Remove existing markers
        const mapInstance = window.mapInstance as google.maps.Map & { markers?: google.maps.Marker[] };
        if (mapInstance.markers) {
          mapInstance.markers.forEach((marker: google.maps.Marker) => {
            marker.setMap(null);
          });
        }

        // Add new marker at selected location
        const marker = new window.google.maps.Marker({
          position: validLocation,
          map: window.mapInstance,
          draggable: true,
          title: "Drag to select location",
        });

        // Store marker reference
        if (!mapInstance.markers) {
          mapInstance.markers = [];
        }
        mapInstance.markers.push(marker);

        // Add dragend listener to marker
        marker.addListener('dragend', () => {
          const position = marker.getPosition();
          if (position) {
            setFormData(prev => ({
              ...prev,
              latitude: position.lat().toString(),
              longitude: position.lng().toString(),
            }));

            // Use reverse geocoding to fill address fields
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: position }, (results: google.maps.GeocoderResult[] | null, status: string) => {
              if (status === 'OK' && results![0]) {
                updateAddressFromGeocode(results![0]);
              }
            });
          }
        });

        // Update form data with selected place
        setFormData(prev => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }));

        // Update address fields
        if (selectedPlace.address_components) {
          updateAddressFromGeocode(selectedPlace);
        }
      } else {
        console.error('Invalid location data:', { geometry, location });
      }
    }
  };

  // Generate unique ID when form opens
  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        id: Date.now().toString()
      }));
      // Reset form state when reopened
      setErrors({});
      setWasSubmitted(false);
      setIsSubmitting(false);
    }
  }, [open]);

  // Load Google Maps script if it's not already loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && open) {
      if (isGoogleMapsLoaded()) {
        setUseGoogleMaps(true);
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
          initializeMap();
        }, 100);
      } else {
        loadGoogleMapsScript(() => {
          setUseGoogleMaps(true);
          // Add a small delay to ensure DOM is ready
          setTimeout(() => {
            initializeMap();
          }, 100);
        });
      }
    }
  }, [open, initializeMap]);

  // Update address fields from geocode result
  const updateAddressFromGeocode = (place: google.maps.GeocoderResult | google.maps.places.PlaceResult) => {
    
    if (!place.address_components) return;

    let address = '';
    let road = '';
    let area = '';
    let city = '';
    let state = '';
    let country = '';
    let pincode = '';

    for (const component of place.address_components) {
      
      const componentType = component.types[0];

      switch (componentType) {
        case 'street_number':
          
          address = `${component.long_name} ${address}`;
          break;
        case 'route':
          road = component.long_name;
          break;
        case 'sublocality_level_1':
          area = component.long_name;
          break;
        case 'locality':
          city = component.long_name;
          break;
        case 'administrative_area_level_1':
          state = component.long_name;
          break;
        case 'country':
          country = component.long_name;
          break;
        case 'postal_code':
          pincode = component.long_name;
          break;
      }
    }

    setFormData(prev => ({
      ...prev,
      address: address || prev.address,
      road: road || prev.road,
      area: area || prev.area,
      city: city || prev.city,
      state: state || prev.state,
      country: country || prev.country,
      pincode: pincode || prev.pincode,
    }));

    // Clear any errors for fields that are now filled
    setErrors(prev => {
      const newErrors = { ...prev };
      if (address) delete newErrors.address;
      if (road) delete newErrors.road;
      if (area) delete newErrors.area;
      if (city) delete newErrors.city;
      return newErrors;
    });
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check required fields
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.road.trim()) {
      newErrors.road = "Road is required";
    }

    if (!formData.area.trim()) {
      newErrors.area = "Area is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'search') {
      setSearchInput(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setWasSubmitted(true);
      setIsSubmitting(true);

      if (!validateForm()) {
        return; // Don't submit if validation fails
      }

      // Prepare location data
      const locationData = {
        ...formData,
        id: Date.now().toString(),
        // Ensure all required fields are present
        address: formData.address.trim(),
        road: formData.road.trim(),
        area: formData.area.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        pincode: formData.pincode.trim(),
        latitude: formData.latitude.trim(),
        longitude: formData.longitude.trim(),
      };

      // Call the parent's onLocationSubmit callback
      if (onLocationSubmit) {
        await onLocationSubmit(locationData);
      }

      // Update search input with full address
      const fullAddress = [
        locationData.address,
        locationData.road,
        locationData.area,
        locationData.city,
        locationData.state,
        locationData.country,
        locationData.pincode
      ].filter(Boolean).join(', ');
      setSearchInput(fullAddress);

      // Reset form state
      setFormData({
        id: '',
        address: '',
        road: '',
        area: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        latitude: '',
        longitude: '',
      });
      setErrors({});
      setWasSubmitted(false);

      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error('Error submitting location:', error);
      toast.error('Failed to save location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Reset form state when component unmounts
      setFormData({
        id: '',
        address: '',
        road: '',
        area: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        latitude: '',
        longitude: '',
      });
      setErrors({});
      setWasSubmitted(false);
      setIsSubmitting(false);
      setUseGoogleMaps(false);
      
      // Clean up map instance
      window.mapInstance = null;
    };
  }, []);

  // Handle dialog close
  const handleDialogClose = () => {
    setOpen(false);
    // Reset form state when dialog closes
    setFormData({
      id: '',
      address: '',
      road: '',
      area: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      latitude: '',
      longitude: '',
    });
    setErrors({});
    setWasSubmitted(false);
    setIsSubmitting(false);
    
    // Clean up map instance
    window.mapInstance = null;
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAP_API_KEY} libraries={libraries}>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogOverlay className="bg-[#003161] opacity-50 fixed inset-0 z-[100]" />

        <DialogContent className="bg-white p-6 min-w-[90%] rounded-xl overflow-y-auto max-h-[90vh] mx-auto text-center z-[101]">
          <DialogTitle className="text-xl font-semibold mb-4">Add Location</DialogTitle>

          <div className="grid grid-cols-1 gap-6 items-center">
            {/* Search Box */}
            <div className="w-full">
              <StandaloneSearchBox
                onLoad={(ref) => (searchBoxRef.current = ref)}
                onPlacesChanged={handlePlacesChanged}
              >
                <Input
                  type="text"
                  name="search"
                  placeholder="Search for a location"
                  className="w-full h-[52px] border-[#05244f] mb-4"
                  value={searchInput}
                  onChange={handleInputChange}
                />
              </StandaloneSearchBox>
              <Button
                onClick={handleSearch}
                className="w-full bg-[#05244F] text-white mb-4"
                disabled={!selectedPlace}
              >
                Search By Location
              </Button>
            </div>

            {/* Map Container */}
            <div className="flex justify-center w-full">
              {useGoogleMaps && (
                <div
                  ref={mapRef}
                  className="w-full h-[420px] rounded-lg shadow-md"
                  style={{ minWidth: "300px" }}
                  aria-label="Location map"
                ></div>
              )}
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-[15px] border border-[#05244f] p-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className={`h-[52px] border-[#05244f] ${wasSubmitted && errors.address ? 'border-red-500' : ''}`}
                    aria-required="true"
                    // aria-invalid={!!errors.address}
                  />
                  {wasSubmitted && errors.address && (
                    <p className="text-red-500 text-sm" role="alert">{errors.address}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                    Road <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="road"
                    value={formData.road}
                    onChange={handleInputChange}
                    placeholder="Road"
                    className={`h-[52px] border-[#05244f] ${wasSubmitted && errors.road ? 'border-red-500' : ''}`}
                    aria-required="true"
                    aria-invalid={!!errors.road}
                  />
                  {wasSubmitted && errors.road && (
                    <p className="text-red-500 text-sm" role="alert">{errors.road}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                    Area <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Area"
                    className={`h-[52px] border-[#05244f] ${wasSubmitted && errors.area ? 'border-red-500' : ''}`}
                    aria-required="true"
                    aria-invalid={!!errors.area}
                  />
                  {wasSubmitted && errors.area && (
                    <p className="text-red-500 text-sm" role="alert">{errors.area}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className={`h-[52px] border-[#05244f] ${wasSubmitted && errors.city ? 'border-red-500' : ''}`}
                    aria-required="true"
                    aria-invalid={!!errors.city}
                  />
                  {wasSubmitted && errors.city && (
                    <p className="text-red-500 text-sm" role="alert">{errors.city}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">State</Label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="h-[52px] border-[#05244f]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">Country</Label>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    className="h-[52px] border-[#05244f]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">Pincode</Label>
                  <Input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Pincode"
                    className="h-[52px] border-[#05244f]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4 sticky bottom-0 bg-white p-4">
            <Button
              variant="outline"
              onClick={handleDialogClose}
              className="z-[102]"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleSubmit}
              className="bg-[#05244F] text-white z-[102]"
              disabled={isSubmitting}
              aria-label="Save location"
            >
              {isSubmitting ? 'Saving...' : 'Save Location'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </LoadScript>
  );
}