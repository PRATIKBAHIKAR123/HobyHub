import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import { useEffect, useState, useRef } from "react";
import useLocation from "../hooks/useLocation";
import { Loader } from "lucide-react";
import { loadGoogleMapsScript, isGoogleMapsLoaded } from "../lib/googleMaps";

// Extend the Window interface to include google
declare global {
  interface Window {
    google?: any;
  }
}

interface PopupScreenProps {
  onLocationChange: (location: string) => void;
}

export default function LocationPopup({ onLocationChange }: PopupScreenProps) {
  const { location, setLocation, detectLocation, isDetecting } = useLocation();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(location || "");
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);

  // Initialize Google Maps Script
  useEffect(() => {
    if (isGoogleMapsLoaded()) {
      setScriptLoaded(true);
      initializeServices();
      return;
    }

    loadGoogleMapsScript(() => {
      setScriptLoaded(true);
      initializeServices();
    });

    return () => {
      if (mapDivRef.current) {
        mapDivRef.current.remove();
      }
    };
  }, []);

  const initializeServices = () => {
    if (window.google && window.google.maps) {
      try {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        
        // Create a hidden div for PlacesService
        if (!mapDivRef.current) {
          mapDivRef.current = document.createElement('div');
          mapDivRef.current.style.display = 'none';
          document.body.appendChild(mapDivRef.current);
        }
        
        placesService.current = new window.google.maps.places.PlacesService(mapDivRef.current);
      } catch (error) {
        console.error('Error initializing Google Maps services:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length > 0 && autocompleteService.current) {
      setIsLoading(true);
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: 'in' },
          types: ['(cities)'],
        },
        (predictions: google.maps.places.AutocompletePrediction[] | null, status: string) => {
          setIsLoading(false);
          if (status === 'OK' && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = async (placeId: string, description: string) => {
    setInputValue(description);
    setShowSuggestions(false);
    setSuggestions([]);
    setIsLoading(true);

    if (placesService.current) {
      placesService.current.getDetails(
        { placeId, fields: ['geometry', 'formatted_address'] },
        (place: google.maps.places.PlaceResult | null, status: string) => {
          setIsLoading(false);
          if (status === 'OK' && place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            localStorage.setItem('userLocation', description);
            localStorage.setItem('userLatLng', JSON.stringify({ lat, lng }));
            
            setLocation(description);
            onLocationChange(description);
          }
        }
      );
    }
  };

  const handleSearch = () => {
    if (inputValue) {
      // Try to find a matching suggestion
      const matchingSuggestion = suggestions.find(s => s.description === inputValue);
      if (matchingSuggestion) {
        handleSelect(matchingSuggestion.place_id, matchingSuggestion.description);
      } else {
        // If no matching suggestion, use the input value directly
        setLocation(inputValue);
        onLocationChange(inputValue);
      }
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
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader className="w-4 h-4 animate-spin" />
          </div>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.place_id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(suggestion.place_id, suggestion.description);
                }}
              >
                {suggestion.description}
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