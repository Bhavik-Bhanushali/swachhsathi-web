import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useCallback } from "react";

export default function Map({ latitude, longitude, address, markers = [] }) {
  const libraries = ["marker"];
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  // Use provided coordinates or fallback to Mumbai center
  const center = { 
    lat: latitude || 19.076, 
    lng: longitude || 72.8777 
  };

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => {
      if (marker.map) {
        marker.map = null;
      }
    });
    markersRef.current = [];
  }, []);

  // Create markers function
  const createMarkers = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    console.log('Creating markers, count:', markers.length);
    clearMarkers();

    // If we have multiple markers, create them
    if (markers && markers.length > 0) {
      markers.forEach((markerData, index) => {
        if (markerData.lat && markerData.lng) {
          console.log(`Creating marker ${index}:`, markerData);
          
          const marker = new google.maps.marker.AdvancedMarkerElement({
            map: mapRef.current,
            position: { lat: markerData.lat, lng: markerData.lng },
            title: markerData.title || markerData.address || "Location",
          });
          markersRef.current.push(marker);
        }
      });

      console.log('Total markers created:', markersRef.current.length);

      // Adjust bounds to fit all markers
      if (markers.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach((markerData) => {
          if (markerData.lat && markerData.lng) {
            bounds.extend({ lat: markerData.lat, lng: markerData.lng });
          }
        });
        mapRef.current.fitBounds(bounds);
      } else if (markers.length === 1) {
        mapRef.current.setCenter({ lat: markers[0].lat, lng: markers[0].lng });
        mapRef.current.setZoom(15);
      }
    } else if (latitude && longitude) {
      // Single marker fallback
      console.log('Creating single fallback marker');
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: center,
        title: address || "Location",
      });
      markersRef.current.push(marker);
    }
  }, [markers, latitude, longitude, address, center, clearMarkers]);

  // Create markers when map is ready or markers change
  useEffect(() => {
    if (mapRef.current && isLoaded) {
      createMarkers();
    }
  }, [isLoaded, createMarkers]);

  const handleLoad = useCallback((map) => {
    console.log('Map loaded');
    mapRef.current = map;
    createMarkers();
  }, [createMarkers]);

  if (!isLoaded) return null;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={markers && markers.length > 0 ? 12 : 15}
      options={{
        mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
      }}
      onLoad={handleLoad}
    />
  );
}
