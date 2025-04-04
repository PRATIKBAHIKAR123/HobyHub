import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import { useEffect, useState, useRef } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import useLocation from "../hooks/useLocation";
import { Loader } from "lucide-react";

// Extend the Window interface to include initPlacesAPI
declare global {
  interface Window {
    initPlacesAPI?: () => void;
  }
}

// Global variable to track if script is loading
let isScriptLoading = false;

// Improved Google Maps API script loader
const loadGoogleMapsScript = (callback: { (): void; (): void; }) => {
  // Check if script is already loaded
  if (window.google && window.google.maps && window.google.maps.places) {
    if (callback) callback();
    return;
  }
  
  // Don't load script if it's already loading
  if (isScriptLoading) {
    const checkGoogleExists = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(checkGoogleExists);
        if (callback) callback();
      }
    }, 100);
    return;
  }

  const existingScript = document.getElementById('google-maps-script');
  if (!existingScript) {
    isScriptLoading = true;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBiXRza3cdC49oDky7hLyXPqkQhaNM4yts&libraries=places&region=IN&loading=async&callback=initPlacesAPI`;
    script.id = 'google-maps-script';
    script.async = true;
    script.defer = true;
    
    // Create global callback
    window.initPlacesAPI = () => {
      isScriptLoading = false;
      if (callback) callback();
    };
    
    document.body.appendChild(script);
  } else if (callback) {
    callback();
  }
};

interface PopupScreenProps {
  onLocationChange: (location: string) => void;
}

export default function LocationPopup({ onLocationChange }: PopupScreenProps) {
  const { location, setLocation, detectLocation, isDetecting } = useLocation();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const searchInputRef = useRef(null);
  
  // Initialize Google Maps Script
  useEffect(() => {
    loadGoogleMapsScript(() => {
      setScriptLoaded(true);
      console.log("Google Maps script loaded successfully!");
    });
    
    // Clean up function
    return () => {
      if (window.initPlacesAPI) {
        window.initPlacesAPI = undefined;
      }
    };
  }, []);
  
  // Autocomplete setup
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'in' },
    },
    debounce: 200,
    defaultValue: location || "",
    cacheKey: "location-search",
    initOnMount: scriptLoaded,
  });
  
  // Debug logs
  useEffect(() => {
    console.log(`Places API ready: ${ready}, Script loaded: ${scriptLoaded}`);
    
    if (scriptLoaded && !ready) {
      console.log("Script is loaded but Places API is not ready. Re-initializing...");
      // Force reinitialize if needed
      const checkPlacesExists = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(checkPlacesExists);
          console.log("Places API exists in window object");
        }
      }, 500);
      
      return () => clearInterval(checkPlacesExists);
    }
  }, [ready, scriptLoaded]);
  
  // Update input value when location changes
  useEffect(() => {
    if (ready && location && location !== value) {
      setValue(location, false);
      console.log(`Updated value from location: ${location}`);
    }
  }, [location, setValue, value, ready]);
  
  // Function to directly initialize places autocomplete without the hook
  // as a fallback mechanism
  const initializePlacesDirectly = () => {
    if (!ready && scriptLoaded && searchInputRef.current && window.google?.maps?.places) {
      try {
        const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
          componentRestrictions: { country: 'in' },
          
        });
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            handleSelect(place.formatted_address);
          }
        });
        
        console.log("Direct Places Autocomplete initialization successful");
      } catch (error) {
        console.error("Failed to initialize Places directly:", error);
      }
    }
  };
  
  // Initialize direct autocomplete as a backup
  useEffect(() => {
    if (scriptLoaded && !ready && searchInputRef.current) {
      const timer = setTimeout(() => {
        initializePlacesDirectly();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [scriptLoaded, ready]);

  const handleInputFocus = () => {
    setInputFocused(true);
    if (value && value.length > 0 && ready) {
      // Force refresh suggestions
      setValue(value);
    }
  };

  const handleSelect = async (description: string, placeObject: google.maps.places.PlaceResult | null = null) => {
    if (ready) {
      setValue(description, false);
      clearSuggestions();
    }
    setInputFocused(false);

    try {
      let exactLocation = description;
      let lat, lng;

      if (placeObject && placeObject.geometry) {
        // If we have a direct place object (from native API)
        lat = placeObject.geometry?.location?.lat?.();
        lng = placeObject.geometry?.location?.lng?.();
        
        // Try to get the most specific name
        exactLocation = placeObject.name || 
                        placeObject.vicinity || 
                        placeObject.formatted_address ||
                        description;
      } else {
        // Otherwise use geocoding
        const results = await getGeocode({ address: description });
        const latLng = await getLatLng(results[0]);
        // lat = latLng.lat;
        // lng = latLng.lng;
        
        // Get the most specific name from address components
        const addressComponents = results[0].address_components;
        
        // Try to extract the specific place or location name
        const premiseComponent = addressComponents.find(
          component => component.types.includes("premise")
        );
        
        const poiComponent = addressComponents.find(
          component => component.types.includes("point_of_interest")
        );
        
        const establishmentComponent = addressComponents.find(
          component => component.types.includes("establishment")
        );
        
        const sublocalityComponent = addressComponents.find(
          component => component.types.includes("sublocality") || 
                       component.types.includes("sublocality_level_1")
        );
        
        const localityComponent = addressComponents.find(
          component => component.types.includes("locality")
        );
        
        // Prioritize specific place names over general areas
        exactLocation = premiseComponent?.long_name || 
                        poiComponent?.long_name || 
                        establishmentComponent?.long_name || 
                        sublocalityComponent?.long_name || 
                        localityComponent?.long_name || 
                        description;
      }
      
      // Update location and notify parent
      setLocation(exactLocation);
      onLocationChange(exactLocation);
    } catch (error) {
      console.log("Error fetching location details:", error);
    }
    };
  

  const handleChange = (e: { target: { value: string; }; }) => {
    const newValue = e.target.value;
    
    // if (ready) {
      setValue(newValue);
    // }
    
    if (!newValue) {
      setLocation("");
    }
  };

  const handleSearch = () => {
    if (value) {
      handleSelect(value);
    }
  };

  // Loading state
  if (!scriptLoaded) {
    return (
      <PopoverContent className="w-[300px] shadow-md p-4">
        <div className="flex items-center justify-center py-4">
          <Loader className="w-5 h-5 mr-2 animate-spin" /> Loading maps...
        </div>
      </PopoverContent>
    );
  }

  // Show suggestions when ready and has data
  const shouldShowSuggestions = status === "OK" && inputFocused && data.length > 0;

  return (
    <PopoverContent className="w-[300px] shadow-md p-4" onOpenAutoFocus={(e) => e.preventDefault()}>
      <h3 className="text-lg font-semibold">Choose your location</h3>
      <p className="text-gray-500 text-sm">Select a location to see hobby options</p>

      <div className="relative mt-3">
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Enter location"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
          value={value}
          onChange={handleChange}
          onFocus={handleInputFocus}
          onBlur={() => {
            setTimeout(() => setInputFocused(false), 200);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              handleSearch();
            }
          }}
        />

        {/* Suggestions dropdown */}
        {shouldShowSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
            {data.map(({ description, place_id }) => (
              <div
                key={place_id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(description);
                }}
              >
                {description}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-4 space-y-2">
        <Button 
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleSearch}
        >
          Search By Location
        </Button>
        <hr />
        <Button 
          className="w-full bg-yellow-500 text-black hover:bg-yellow-600" 
          onClick={detectLocation}
        >
          {isDetecting ? (
            <div className="flex items-center justify-center">
              <Loader className="w-4 h-4 mr-2 animate-spin" /> Detecting...
            </div>
          ) : (
            "Detect My Location"
          )}
        </Button>
      </div>
    </PopoverContent>
  );
}