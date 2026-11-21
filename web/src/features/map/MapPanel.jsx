import { useEffect, useMemo, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { getCuisineColor } from "../globe/cuisineColors";
import MapPin from "./MapPin";
import PinCard from "./PinCard";
import "./map.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DOWNTOWN = { lat: 49.2827, lng: -123.1207 };

// Fits the map to the chosen region, or to every pin when no region is chosen
function FitToRegion({ region, restaurants }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (region?.min_lat != null) {
      map.fitBounds(
        {
          north: region.max_lat,
          south: region.min_lat,
          east: region.max_lng,
          west: region.min_lng,
        },
        24,
      );
      return;
    }

    if (restaurants.length === 0) return;
    const lats = restaurants.map((r) => r.lat);
    const lngs = restaurants.map((r) => r.lng);
    map.fitBounds(
      {
        north: Math.max(...lats),
        south: Math.min(...lats),
        east: Math.max(...lngs),
        west: Math.min(...lngs),
      },
      48,
    );
  }, [map, region, restaurants]);

  return null;
}

export default function MapPanel({ restaurants, region }) {
  const [selectedId, setSelectedId] = useState(null);

  // Only restaurants with coordinates, and only the chosen region's
  const visible = useMemo(
    () =>
      restaurants.filter(
        (r) =>
          r.lat != null &&
          r.lng != null &&
          (!region || r.region?.slug === region.slug),
      ),
    [restaurants, region],
  );

  const selected = visible.find((r) => r.id === selectedId) ?? null;

  if (!API_KEY) {
    return <div className='map-panel map-panel--empty'>Map unavailable</div>;
  }

  return (
    <section
      className='map-panel'
      aria-label={region ? `Map of ${region.name}` : "Map of all regions"}
    >
      <APIProvider apiKey={API_KEY}>
        <Map
          mapId='DEMO_MAP_ID'
          defaultCenter={DOWNTOWN}
          defaultZoom={12}
          gestureHandling='cooperative'
          disableDefaultUI
          zoomControl
          clickableIcons={false}
          onClick={() => setSelectedId(null)}
        >
          <FitToRegion region={region} restaurants={visible} />
          {visible.map((r) => (
            <AdvancedMarker
              key={r.id}
              position={{ lat: r.lat, lng: r.lng }}
              title={r.name}
              zIndex={r.id === selectedId ? 2 : 1}
              onClick={() => setSelectedId(r.id)}
            >
              <MapPin
                color={getCuisineColor(r.cuisine)}
                active={r.id === selectedId}
              />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>

      {selected && (
        <PinCard restaurant={selected} onClose={() => setSelectedId(null)} />
      )}
    </section>
  );
}
