import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import { useRef, useState } from "react";
import { Libraries, LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import useLocation from "../hooks/useLocation";
import { useFilter } from "@/contexts/FilterContext";

const libraries: Libraries = ["places"];
const GOOGLE_API_KEY = "AIzaSyBiXRza3cdC49oDky7hLyXPqkQhaNM4yts";

interface PopupScreenProps {
  onLocationChange: (location: string) => void;
  defaultLocation?: string;
}

export default function LocationPopup({onLocationChange}: PopupScreenProps) {
  const { location, setLocation, detectLocation } = useLocation();
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const { triggerFilterUpdate, setLocation: setFilterLocation } = useFilter();
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      setSelectedPlace(place);
      
      // Get the most specific location name available
      const locationName = place.formatted_address || place.name || "";
      setLocation(locationName);
    }
  };

  const handleSearch = () => {
    if (selectedPlace) {
      // Use the full formatted address
      const fullAddress = selectedPlace.formatted_address || selectedPlace.name || location;
      onLocationChange(fullAddress);
      setFilterLocation(fullAddress);
      triggerFilterUpdate(); // Trigger filter update to refresh activities
    }
  };

  const handleDetectLocation = async () => {
    try {
      setIsDetecting(true);
      await detectLocation();
      // The location state will be updated by the useLocation hook
      if (location) {
        onLocationChange(location);
        setFilterLocation(location);
        triggerFilterUpdate(); // Trigger filter update to refresh activities
      }
    } catch (error) {
      console.error("Error detecting location:", error);
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={libraries}>
      <PopoverContent 
        className="w-[300px] shadow-md p-4"
        onPointerDownOutside={(e) => {
          // Prevent closing when clicking on the search box
          if (e.target instanceof HTMLElement && 
              (e.target.closest('.pac-container') || 
               e.target.closest('.pac-item'))) {
            e.preventDefault();
          }
        }}
      >
        <h3 className="text-lg font-semibold">Choose your location</h3>
        <p className="text-gray-500 text-sm">Select a location to see hobby options</p>

        {/* Google Autocomplete Input */}
        <StandaloneSearchBox 
          onLoad={(ref) => (searchBoxRef.current = ref)} 
          onPlacesChanged={handlePlacesChanged}
        >
          <Input
            type="text"
            placeholder="Enter location"
            className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </StandaloneSearchBox>

        {/* Buttons */}
        <div className="mt-4 space-y-2">
          <Button 
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSearch}
            disabled={!selectedPlace}
          >
            Search By Location
          </Button>
          <hr />
          <Button 
            className="w-full bg-yellow-500 text-black hover:bg-yellow-600" 
            onClick={handleDetectLocation}
            disabled={isDetecting}
          >
            {isDetecting ? "Detecting..." : "Detect My Location"}
          </Button>
        </div>
      </PopoverContent>
    </LoadScript>
  );
}
