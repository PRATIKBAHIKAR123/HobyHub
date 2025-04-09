'use client';

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { GOOGLE_MAP_API_KEY } from "@/lib/apiConfigs";

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

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useGoogleMaps, setUseGoogleMaps] = useState(false);

  // Generate unique ID when form opens
  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        id: Date.now().toString()
      }));
    }
  }, [open]);

  // Load Google Maps script if it's not already loaded
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && open) {
      // Check if the Google Maps script is already loaded
      if (!window.google?.maps) {
        setUseGoogleMaps(false);
        
        // In a real implementation, you would add the Google Maps API script like this:
        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setMapLoaded(true);
          initializeMap();
        };
        document.head.appendChild(script);
        
        
        // For now, we'll just use the placeholder image
        console.log("Google Maps API would be loaded here in production");
      } else {
        setMapLoaded(true);
        setUseGoogleMaps(true);
        initializeMap();
      }
    }
  }, [open]);

  // Initialize map
  const initializeMap = () => {
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
          geocoder.geocode({ location: position }, (results, status) => {
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
  };
  
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
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
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
        <div className="grid grid-cols-1 gap-6 items-center">
          {/* Map Container */}
          <div className="flex justify-center w-full">
            {useGoogleMaps ? (
              <div 
                ref={mapRef} 
                className="w-full h-[420px] rounded-lg shadow-md"
                style={{ minWidth: "300px" }}
              ></div>
            ) : (
              <Image
                src="/images/map.png"
                height={420}
                width={1450}
                className="max-w-full w-auto sm:w-[80%] object-contain mx-auto rounded-lg"
                alt="Map"
              />
            )}
          </div>
          
          {/* Form Section */}
          <div className="bg-white rounded-[15px] border border-[#05244f] p-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Address</Label>
                <Input 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Address" 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Near by landmark</Label>
                <Input 
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="Near by landmark" 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Area</Label>
                <Input 
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="Area" 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">City</Label>
                <Input 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City" 
                  className="h-[52px] border-[#05244f]" 
                />
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
              {/* <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Coordinates</Label>
                <div className="flex gap-2">
                  <Input 
                    value={formData.latitude !== undefined ? formData.latitude.toFixed(6) : ''}
                    readOnly
                    placeholder="Latitude" 
                    className="h-[52px] border-[#05244f]" 
                  />
                  <Input 
                    value={formData.longitude !== undefined ? formData.longitude.toFixed(6) : ''}
                    readOnly
                    placeholder="Longitude" 
                    className="h-[52px] border-[#05244f]" 
                  />
                </div>
              </div> */}
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
          >
            Save Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
