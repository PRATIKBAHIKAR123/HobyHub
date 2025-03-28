
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {  PopoverContent } from "@/components/ui/popover";
import {  useRef, } from "react";
import { Libraries, LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import useLocation from "../hooks/useLocation";

const libraries: Libraries = ["places"];
const GOOGLE_API_KEY = "AIzaSyBiXRza3cdC49oDky7hLyXPqkQhaNM4yts";

interface PopupScreenProps {
  onLocationChange: (location: string) => void;
}

export default function LocationPopup({onLocationChange}: PopupScreenProps) {

  const { location, setLocation, detectLocation,isDetecting } = useLocation();
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  
  // const handleBlur = () => {
  //   if (!location) {
  //     handlePlacesChanged();
  //   }
  // };

  const handlePlacesChanged = () => {
    if (!searchBoxRef.current) return;
    
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const selectedLocation = places?.[0]?.address_components?.[1]?.long_name || "";
      setLocation(selectedLocation);
      onLocationChange(selectedLocation);
    }
  };
  
  return (

    <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={libraries} region={"IN"} loadingElement={<div></div>} >
    <PopoverContent className="w-[300px] shadow-md p-4">
      <h3 className="text-lg font-semibold">Choose your location</h3>
      <p className="text-gray-500 text-sm">Select a location to see hobby options</p>

      {/* Google Autocomplete Input */}
      <StandaloneSearchBox onLoad={(ref) => (searchBoxRef.current = ref)} onPlacesChanged={handlePlacesChanged}>
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
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Search By Location</Button>
          <hr />
          <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-600" onClick={detectLocation}>
            {isDetecting ? (
              <div className="flex items-center justify-center">
                <span className="loader mr-2"></span> Detecting...
              </div>
            ) : (
              "Detect My Location"
            )}

          </Button>
        </div>
    </PopoverContent>
  </LoadScript>
   
  );
}
