'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadGoogleMapsScript, isGoogleMapsLoaded } from "../../lib/googleMaps";


interface PopupScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onLocationSubmit?: (locationData: LocationData) => void;
}

// Define the location data structure
export interface LocationData {
  id: string;
  address: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
}

export default function LocationPopupScreen({ open, setOpen, onLocationSubmit }: PopupScreenProps) {
  // State for form data
  const [formData, setFormData] = useState<LocationData>({
    id: '',
    address: '',
    landmark: '',
    area: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    latitude: undefined,
    longitude: undefined,
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Track if form was submitted
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useGoogleMaps, setUseGoogleMaps] = useState(false);

  // Initialize map
  const initializeMap = useCallback(() => {
    if (mapLoaded && mapRef.current && window.google?.maps) {
      const mapOptions = {
        center: { lat: 19.0760, lng: 72.8777 }, // Default to Mumbai
        zoom: 15,
      };
      
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      
      // Add a marker that can be dragged to set the location
      const marker = new window.google.maps.Marker({
        position: mapOptions.center,
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
            latitude: position.lat(),
            longitude: position.lng(),
          }));
          
          // Optionally use reverse geocoding to fill address fields
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: position }, (results: google.maps.GeocoderResult[] | null, status: string) => {
            if (status === 'OK' && results![0]) {
              updateAddressFromGeocode(results![0]);
            }
          });
        }
      });
      
      // Add search box (optional enhancement)
      const input = document.createElement('input');
      input.className = 'controls';
      input.type = 'text';
      input.placeholder = 'Search for a location';
      input.style.margin = '10px';
      input.style.padding = '10px';
      input.style.width = 'calc(100% - 20px)';
      input.style.boxSizing = 'border-box';
      
      map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(input);
      
      const searchBox = new window.google.maps.places.SearchBox(input);
      
      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds()!);
      });
      
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        
        if (places?.length === 0) return;
        
        const place = places![0];
        
        if (!place.geometry || !place.geometry.location) return;
        
        // Update marker and map
        marker.setPosition(place.geometry.location);
        map.setCenter(place.geometry.location);
        
        // Update form data
        setFormData(prev => ({
          ...prev,
          latitude: place.geometry?.location?.lat(),
          longitude: place.geometry?.location?.lng(),
        }));
        
        // Update address fields
        if (place.address_components) {
          updateAddressFromGeocode(place);
        }
      });
    }
  }, [mapLoaded]);

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
    }
  }, [open]);

  // Load Google Maps script if it's not already loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && open) {
      if (isGoogleMapsLoaded()) {
        setMapLoaded(true);
        setUseGoogleMaps(true);
        initializeMap();
      } else {
        loadGoogleMapsScript(() => {
          setMapLoaded(true);
          setUseGoogleMaps(true);
          initializeMap();
        });
      }
    }
  }, [open, initializeMap]);

  // Update address fields from geocode result
  const updateAddressFromGeocode = (place: google.maps.GeocoderResult | google.maps.places.PlaceResult) => {
    if (!place.address_components) return;
    
    let address = '';
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
          address += component.long_name;
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
      area: area || prev.area,
      city: city || prev.city,
      state: state || prev.state,
      country: country || prev.country,
      pincode: pincode || prev.pincode,
    }));

    // Clear any errors for fields that are now filled
    setErrors(prev => {
      const newErrors = {...prev};
      if (address) delete newErrors.address;
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
    
    if (!formData.landmark.trim()) {
      newErrors.landmark = "Landmark is required";
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

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    setWasSubmitted(true);
    
    if (!validateForm()) {
      return; // Don't submit if validation fails
    }
    
    if (onLocationSubmit) {
      onLocationSubmit(formData);
    }
    
    // Save to localStorage
    const savedLocations = localStorage.getItem('locations');
    const locations = savedLocations ? JSON.parse(savedLocations) : [];
    locations.push(formData);
    localStorage.setItem('locations', JSON.stringify(locations));
    
    // Reset form and close dialog
    setFormData({
      id: '',
      address: '',
      landmark: '',
      area: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      latitude: undefined,
      longitude: undefined,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="bg-[#003161] opacity-50 fixed inset-0" />
      
      <DialogContent className="bg-white p-6 min-w-[90%] rounded-xl overflow-y-scroll max-h-screen mx-auto text-center">
        <DialogTitle className="text-xl font-semibold mb-4">Add Location</DialogTitle>
        
        <div className="grid grid-cols-1 gap-6 items-center">
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
                  className={`h-[52px] border-[#05244f] ${wasSubmitted && errors.address ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-required="true"
                  aria-invalid={!!errors.address}
                />
                {wasSubmitted && errors.address && (
                  <p className="text-red-500 text-sm" role="alert">{errors.address}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                  Near by landmark <span className="text-red-500">*</span>
                </Label>
                <Input 
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="Near by landmark" 
                  className={`h-[52px] border-[#05244f] ${wasSubmitted && errors.landmark ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-required="true"
                  aria-invalid={!!errors.landmark}
                />
                {wasSubmitted && errors.landmark && (
                  <p className="text-red-500 text-sm" role="alert">{errors.landmark}</p>
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
                  className={`h-[52px] border-[#05244f] ${wasSubmitted && errors.area ? 'border-red-500 focus:ring-red-500' : ''}`}
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
                  className={`h-[52px] border-[#05244f] ${wasSubmitted && errors.city ? 'border-red-500 focus:ring-red-500' : ''}`}
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
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSubmit} 
            className="bg-[#05244F] text-white"
            aria-label="Save location"
          >
            Save Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}