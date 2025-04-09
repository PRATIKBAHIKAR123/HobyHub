"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Removed direct image imports
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface MapComponentProps {
  lat: number;
  lng: number;
  address: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ lat, lng, address }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || typeof window === 'undefined') return;

    const center: L.LatLngTuple = [lat, lng];

    // Initialize map only if it hasn't been initialized yet
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(center, 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // Add a circle instead of a marker
      L.circle(center, {
        color: '#3388ff',
        fillColor: '#3388ff',
        fillOpacity: 0.5,
        radius: 50
      }).addTo(mapRef.current)
        .bindPopup(address)
        .openPopup();
    } else {
      // If map already exists, update view and circle
      mapRef.current.setView(center, 15);
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Circle) {
          mapRef.current?.removeLayer(layer);
        }
      });
      // Add new circle
      L.circle(center, {
        color: '#3388ff',
        fillColor: '#3388ff',
        fillOpacity: 0.5,
        radius: 50
      }).addTo(mapRef.current)
        .bindPopup(address)
        .openPopup();
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, address]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[400px] rounded-lg shadow-lg border border-gray-300"
      style={{ zIndex: 1 }}
    />
  );
};

export default MapComponent; 