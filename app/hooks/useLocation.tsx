import { useState, useEffect } from "react";

const GOOGLE_API_KEY = "AIzaSyBiXRza3cdC49oDky7hLyXPqkQhaNM4yts";
const DEFAULT_LOCATION = "Pune";

const useLocation = () => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results.length > 0) {
        // Try to get the locality (city) from address components
        const addressComponents = data.results[0].address_components;
        
        // First try to find a locality component (city)
        const cityComponent = addressComponents.find(
          (component: { types: string | string[]; }) => component.types.includes("locality") || component.types.includes("administrative_area_level_3")
        );
        
        // If no locality found, try administrative_area_level_2 (district/county)
        const districtComponent = !cityComponent
          ? addressComponents.find(
              (component: { types: string | string[]; }) => component.types.includes("administrative_area_level_2")
            )
          : null;
        
        // If neither found, try sublocality
        const sublocalityComponent = !cityComponent && !districtComponent
          ? addressComponents.find(
              (component: { types: string | string[]; }) => component.types.includes("sublocality")
            )
          : null;
        
        // Set the location based on available components
        const locationName = 
          cityComponent?.long_name || 
          districtComponent?.long_name || 
          sublocalityComponent?.long_name ||
          addressComponents[1]?.long_name ||
          DEFAULT_LOCATION;
        
        setLocation(locationName);
        setCoordinates({ lat, lng });
        
        return locationName;
      } else {
        setLocation(DEFAULT_LOCATION);
        return DEFAULT_LOCATION;
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setLocation(DEFAULT_LOCATION);
      return DEFAULT_LOCATION;
    }
  };

  const detectLocation = () => {
    setIsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getAddressFromCoordinates(latitude, longitude).finally(() => {
            setIsDetecting(false);
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsDetecting(false);
          setLocation(DEFAULT_LOCATION);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setIsDetecting(false);
      setLocation(DEFAULT_LOCATION);
    }
  };

  // Auto-detect location on startup
  useEffect(() => {
    detectLocation();
  }, []); // Empty dependency array to run only once on mount

  return { 
    location, 
    setLocation, 
    detectLocation, 
    isDetecting,
    coordinates,
    setCoordinates,
    getAddressFromCoordinates
  };
};

export default useLocation;