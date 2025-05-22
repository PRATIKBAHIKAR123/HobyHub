import { GOOGLE_MAP_API_KEY } from "../../lib/apiConfigs";

declare global {
  interface Window {
    google?: any;
    initGoogleMaps?: () => void;
  }
}

let isScriptLoading = false;
let isScriptLoaded = false;
let scriptLoadCallbacks: (() => void)[] = [];

export const loadGoogleMapsScript = (callback?: () => void): void => {
  if (isScriptLoaded) {
    callback?.();
    return;
  }

  if (callback) {
    scriptLoadCallbacks.push(callback);
  }

  if (isScriptLoading) {
    return;
  }

  isScriptLoading = true;

  const existingScript = document.getElementById('google-maps-script');
  if (existingScript) {
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places&region=IN`;
  script.async = true;
  script.defer = true;

  script.onload = () => {
    isScriptLoaded = true;
    isScriptLoading = false;
    scriptLoadCallbacks.forEach(cb => cb());
    scriptLoadCallbacks = [];
  };

  script.onerror = () => {
    isScriptLoading = false;
    console.error('Failed to load Google Maps script');
  };

  document.body.appendChild(script);
};

export const isGoogleMapsLoaded = (): boolean => {
  return isScriptLoaded;
}; 