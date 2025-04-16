declare global {
  interface Window {
    google?: any;
  }
}

let isScriptLoading = false;
let scriptLoadCallbacks: (() => void)[] = [];

export const isGoogleMapsLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.google?.maps;
};

export const loadGoogleMapsScript = (callback?: () => void): void => {
  if (isGoogleMapsLoaded()) {
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

  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (existingScript) {
    const checkLoaded = setInterval(() => {
      if (isGoogleMapsLoaded()) {
        clearInterval(checkLoaded);
        isScriptLoading = false;
        scriptLoadCallbacks.forEach(cb => cb());
        scriptLoadCallbacks = [];
      }
    }, 100);
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&region=IN`;
  script.async = true;
  script.defer = true;

  script.onload = () => {
    isScriptLoading = false;
    scriptLoadCallbacks.forEach(cb => cb());
    scriptLoadCallbacks = [];
  };

  script.onerror = () => {
    isScriptLoading = false;
    console.error('Failed to load Google Maps script');
  };

  document.head.appendChild(script);
}; 