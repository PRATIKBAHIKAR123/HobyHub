'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadGoogleMapsScript, isGoogleMapsLoaded } from "../../lib/googleMaps";
import { toast } from "sonner";

interface PopupScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onLocationSubmit?: (locationData: LocationData) => Promise<void>;
}

// Define the location data structure
export interface LocationData {
  id: string;
  address: string;
  road: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: string;
  longitude: string;
}

export default function LocationPopupScreen({ open, setOpen, onLocationSubmit }: PopupScreenProps) {
  // State for form data
  const [formData, setFormData] = useState<LocationData>({
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

  // const mapRef = useRef<HTMLDivElement>(null);
  // const [ setMapLoaded] = useState(false);
  const [, setUseGoogleMaps] = useState(false);

  // Initialize map
  // const initializeMap = useCallback(() => {
  //   if (mapLoaded && mapRef.current && window.google?.maps) {
  //     const mapOptions = {
  //       center: { lat: 19.0760, lng: 72.8777 }, // Default to Mumbai
  //       zoom: 15,
  //     };

  //     const map = new window.google.maps.Map(mapRef.current, mapOptions);

  //     // Add a marker that can be dragged to set the location
  //     const marker = new window.google.maps.Marker({
  //       position: mapOptions.center,
  //       map: map,
  //       draggable: true,
  //       title: "Drag to select location",
  //     });

  //     // Update form data when marker is dragged
  //     marker.addListener('dragend', () => {
  //       const position = marker.getPosition();
  //       if (position) {
  //         setFormData(prev => ({
  //           ...prev,
  //           latitude: position.lat().toString(),
  //           longitude: position.lng().toString(),
  //         }));

  //         // Optionally use reverse geocoding to fill address fields
  //         const geocoder = new window.google.maps.Geocoder();
  //         geocoder.geocode({ location: position }, (results: google.maps.GeocoderResult[] | null, status: string) => {
  //           if (status === 'OK' && results![0]) {
  //             updateAddressFromGeocode(results![0]);
  //           }
  //         });
  //       }
  //     });

  //     // Add search box (optional enhancement)
  //     const input = document.createElement('input');
  //     input.className = 'controls';
  //     input.type = 'text';
  //     input.placeholder = 'Search for a location';
  //     input.style.margin = '10px';
  //     input.style.padding = '10px';
  //     input.style.width = 'calc(100% - 20px)';
  //     input.style.boxSizing = 'border-box';

  //     map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(input);

  //     const searchBox = new window.google.maps.places.SearchBox(input);

  //     map.addListener('bounds_changed', () => {
  //       searchBox.setBounds(map.getBounds()!);
  //     });

  //     searchBox.addListener('places_changed', () => {
  //       const places = searchBox.getPlaces();

  //       if (places?.length === 0) return;

  //       const place = places![0];

  //       if (!place.geometry || !place.geometry.location) return;

  //       // Update marker and map
  //       marker.setPosition(place.geometry.location);
  //       map.setCenter(place.geometry.location);

  //       // Update form data
  //       setFormData(prev => ({
  //         ...prev,
  //         latitude: place.geometry?.location?.lat().toString(),
  //         longitude: place.geometry?.location?.lng().toString(),
  //       }));

  //       // Update address fields
  //       if (place.address_components) {
  //         updateAddressFromGeocode(place);
  //       }
  //     });
  //   }
  // }, [mapLoaded]);

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
        // setMapLoaded(true);
        setUseGoogleMaps(true);
        // initializeMap();
      } else {
        loadGoogleMapsScript(() => {
          // setMapLoaded(true);
          setUseGoogleMaps(true);
          // initializeMap();
        });
      }
    }
  }, );

  // Update address fields from geocode result
  // const updateAddressFromGeocode = (place: google.maps.GeocoderResult | google.maps.places.PlaceResult) => {
  //   if (!place.address_components) return;

  //   let address = '';
  //   let road = '';
  //   let area = '';
  //   let city = '';
  //   let state = '';
  //   let country = '';
  //   let pincode = '';

  //   for (const component of place.address_components) {
  //     const componentType = component.types[0];

  //     switch (componentType) {
  //       case 'street_number':
  //         address = `${component.long_name} ${address}`;
  //         break;
  //       case 'route':
  //         road = component.long_name;
  //         break;
  //       case 'sublocality_level_1':
  //         area = component.long_name;
  //         break;
  //       case 'locality':
  //         city = component.long_name;
  //         break;
  //       case 'administrative_area_level_1':
  //         state = component.long_name;
  //         break;
  //       case 'country':
  //         country = component.long_name;
  //         break;
  //       case 'postal_code':
  //         pincode = component.long_name;
  //         break;
  //     }
  //   }

  //   setFormData(prev => ({
  //     ...prev,
  //     address: address || prev.address,
  //     road: road || prev.road,
  //     area: area || prev.area,
  //     city: city || prev.city,
  //     state: state || prev.state,
  //     country: country || prev.country,
  //     pincode: pincode || prev.pincode,
  //   }));

  //   // Clear any errors for fields that are now filled
  //   setErrors(prev => {
  //     const newErrors = { ...prev };
  //     if (address) delete newErrors.address;
  //     if (road) delete newErrors.road;
  //     if (area) delete newErrors.area;
  //     if (city) delete newErrors.city;
  //     return newErrors;
  //   });
  // };

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
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
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
        state: formData.state.trim() || 'Maharashtra', // Default state if not provided
        country: formData.country.trim() || 'India', // Default country if not provided
        pincode: formData.pincode.trim() || '411001', // Default pincode if not provided
        latitude: formData.latitude || '18.5204', // Default latitude if not provided
        longitude: formData.longitude || '73.8567', // Default longitude if not provided
      };

      // Call the parent's onLocationSubmit callback
      if (onLocationSubmit) {
        await onLocationSubmit(locationData);
      }

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
      // setMapLoaded(false);
      setUseGoogleMaps(false);
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
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogOverlay className="bg-[#003161] opacity-50 fixed inset-0 z-[100]" />

      <DialogContent className="bg-white p-6 min-w-[90%] rounded-xl overflow-y-auto max-h-[90vh] mx-auto text-center z-[101]">
        <DialogTitle className="text-xl font-semibold mb-4">Add Location</DialogTitle>

        <div className="grid grid-cols-1 gap-6 items-center">
          {/* Map Container */}
          {/* <div className="flex justify-center w-full">
            {useGoogleMaps && (
              <div
                ref={mapRef}
                className="w-full h-[420px] rounded-lg shadow-md"
                style={{ minWidth: "300px" }}
                aria-label="Location map"
              ></div>
            )}
          </div> */}

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
                  aria-invalid={!!errors.address}
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
  );
}