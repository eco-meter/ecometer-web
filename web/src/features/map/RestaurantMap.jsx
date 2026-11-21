import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { Icon } from "@iconify/react";
import { getCuisineColor } from "../globe/cuisineColors";
import MapPin from "./MapPin";
import "./map.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Small map on the restaurant page showing where it is
export default function RestaurantMap({ restaurant }) {
  if (!API_KEY || restaurant.lat == null || restaurant.lng == null) {
    return null;
  }

  const position = { lat: restaurant.lat, lng: restaurant.lng };
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`;

  return (
    <section
      className='restaurant-map'
      aria-label={`Map of ${restaurant.name}`}
    >
      <div className='restaurant-map__frame'>
        <APIProvider apiKey={API_KEY}>
          <Map
            mapId='DEMO_MAP_ID'
            defaultCenter={position}
            defaultZoom={15}
            gestureHandling='cooperative'
            disableDefaultUI
            zoomControl
            clickableIcons={false}
          >
            <AdvancedMarker position={position} title={restaurant.name}>
              <MapPin color={getCuisineColor(restaurant.cuisine)} />
            </AdvancedMarker>
          </Map>
        </APIProvider>
      </div>

      <a
        href={directionsUrl}
        target='_blank'
        rel='noreferrer'
        className='restaurant-map__directions'
      >
        <Icon icon='ph:navigation-arrow-fill' aria-hidden='true' />
        Get directions
      </a>
    </section>
  );
}
