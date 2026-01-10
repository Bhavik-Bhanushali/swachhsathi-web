import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const center = { lat: 19.076, lng: 72.8777 };

export default function Map() {
  const libraries = ["marker"];
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries, // 👈 REQUIRED
  });

  if (!isLoaded) return null;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={center}
      zoom={12}
      options={{
        mapId:import.meta.env.VITE_GOOGLE_MAP_ID,
      }}
      onLoad={(map) => {
        new google.maps.marker.AdvancedMarkerElement({
          map,
          position: center,
          title: "Mumbai",
        });
      }}
    />
  );
}
