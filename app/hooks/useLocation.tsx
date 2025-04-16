import { useState, useEffect, useCallback } from "react";

const GOOGLE_API_KEY = "AIzaSyBiXRza3cdC49oDky7hLyXPqkQhaNM4yts";
const DEFAULT_LOCATION = "Pune";

interface Location {
  latitude: number;
  longitude: number;
}

type LocationState = Location | string | null;

const useLocation = () => {
  const [location, setLocation] = useState<LocationState>(null);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [displayLocation, setDisplayLocation] = useState<string>(DEFAULT_LOCATION);

  const getDisplayLocation = (loc: LocationState, coords: {lat: number, lng: number} | null): string => {
    if (typeof loc === 'string') {
      return loc;
    }
    if (loc && 'latitude' in loc) {
      return `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`;
    }
    if (coords) {
      return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
    }
    return DEFAULT_LOCATION;
  };

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
        
        setLocation({
          latitude: lat,
          longitude: lng,
        });
        setCoordinates({ lat, lng });
        setDisplayLocation(locationName);
        
        return locationName;
      } else {
        setLocation(null);
        setDisplayLocation(DEFAULT_LOCATION);
        return DEFAULT_LOCATION;
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setLocation(null);
      setDisplayLocation(DEFAULT_LOCATION);
      return DEFAULT_LOCATION;
    }
  };

  // Update display location whenever location or coordinates change
  useEffect(() => {
    setDisplayLocation(getDisplayLocation(location, coordinates));
  }, [location, coordinates]);

  const detectLocation = useCallback(() => {
    if (isDetecting) return;
    
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
          setLocation(null);
          setDisplayLocation(DEFAULT_LOCATION);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      setIsDetecting(false);
      setLocation(null);
      setDisplayLocation(DEFAULT_LOCATION);
    }
  }, [isDetecting]);

  // Auto-detect location on startup, but only once
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [setLocation]); // Add setLocation as a dependency

  return { 
    location, 
    setLocation, 
    detectLocation, 
    isDetecting,
    coordinates,
    setCoordinates,
    getAddressFromCoordinates,
    displayLocation
  };
};

export default useLocation;