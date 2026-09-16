export const TILE_SIZE = 256;
export const MIN_ZOOM = 3;
export const MAX_ZOOM = 19;
export const LAYER_STREET = "street";
export const LAYER_SATELLITE = "satellite";

// Dummy saved branches data for franchises

// distance in km between two points
export function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Web Mercator Projection helpers
export function lngToPixel(lng, zoom) {
  return ((lng + 180) / 360) * TILE_SIZE * Math.pow(2, zoom);
}

export function latToPixel(lat, zoom) {
  const sin = Math.sin((lat * Math.PI) / 180);
  const y = 0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI);
  return y * TILE_SIZE * Math.pow(2, zoom);
}

export function pixelToLng(px, zoom) {
  return (px / (TILE_SIZE * Math.pow(2, zoom))) * 360 - 180;
}

export function pixelToLat(py, zoom) {
  const n = Math.PI - (2 * Math.PI * py) / (TILE_SIZE * Math.pow(2, zoom));
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

export async function searchLocation(query) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
    );
    const data = await res.json();
    return data.map((item) => ({
      name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch {
    // geocoding failure means no suggestions
    return [];
  }
}
