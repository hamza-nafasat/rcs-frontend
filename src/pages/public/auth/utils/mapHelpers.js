// ── OpenStreetMap & Esri Tile Configuration ──────────────────────────────────

export const TILE_SIZE = 256;
export const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 };
export const PREVIEW_ZOOM = 4;
export const FULLSCREEN_ZOOM = 5;
export const MIN_ZOOM = 3;
export const MAX_ZOOM = 18;
export const DRAG_THRESHOLD = 5;

export const LAYER_STREET = "street";
export const LAYER_SATELLITE = "satellite";

export const AREA_COLORS = [
  { name: "Orange", stroke: "#f97316", fill: "rgba(249, 115, 22, 0.2)", badgeBg: "#fff7ed", badgeText: "#c2410c" },
  { name: "Blue", stroke: "#2563eb", fill: "rgba(37, 99, 235, 0.2)", badgeBg: "#eff6ff", badgeText: "#1d4ed8" },
  { name: "Emerald", stroke: "#16a34a", fill: "rgba(22, 163, 74, 0.2)", badgeBg: "#f0fdf4", badgeText: "#15803d" },
  { name: "Purple", stroke: "#9333ea", fill: "rgba(147, 51, 234, 0.2)", badgeBg: "#faf5ff", badgeText: "#7e22ce" },
  { name: "Red", stroke: "#dc2626", fill: "rgba(220, 38, 38, 0.2)", badgeBg: "#fef2f2", badgeText: "#b91c1c" },
];

export const getTileUrl = (layer, z, x, y) => {
  if (layer === LAYER_SATELLITE) {
    return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
  }
  return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
};

// ── Tile Math ────────────────────────────────────────────────────────────────

export const lngToPixel = (lng, zoom) =>
  ((lng + 180) / 360) * (TILE_SIZE * Math.pow(2, zoom));

export const latToPixel = (lat, zoom) => {
  const sinLat = Math.sin((lat * Math.PI) / 180);
  return (
    (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) *
    (TILE_SIZE * Math.pow(2, zoom))
  );
};

export const pixelToLng = (px, zoom) =>
  (px / (TILE_SIZE * Math.pow(2, zoom))) * 360 - 180;

export const pixelToLat = (py, zoom) => {
  const n = Math.PI - (2 * Math.PI * py) / (TILE_SIZE * Math.pow(2, zoom));
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};

export const drawTiles = (ctx, width, height, center, zoom, tileCache, layer = LAYER_STREET) => {
  const z = Math.round(zoom);
  const cx = lngToPixel(center.lng, z);
  const cy = latToPixel(center.lat, z);
  const offsetX = width / 2 - cx;
  const offsetY = height / 2 - cy;

  const startTileX = Math.floor(-offsetX / TILE_SIZE);
  const startTileY = Math.floor(-offsetY / TILE_SIZE);
  const endTileX = Math.ceil((width - offsetX) / TILE_SIZE);
  const endTileY = Math.ceil((height - offsetY) / TILE_SIZE);
  const maxTile = Math.pow(2, z);

  ctx.fillStyle = layer === LAYER_SATELLITE ? "#1a1a2e" : "#e8ecf1";
  ctx.fillRect(0, 0, width, height);

  for (let tx = startTileX; tx < endTileX; tx++) {
    for (let ty = startTileY; ty < endTileY; ty++) {
      if (ty < 0 || ty >= maxTile) continue;
      const wrappedTx = ((tx % maxTile) + maxTile) % maxTile;
      const key = `${layer}/${z}/${wrappedTx}/${ty}`;
      const screenX = tx * TILE_SIZE + offsetX;
      const screenY = ty * TILE_SIZE + offsetY;

      const cached = tileCache.current.get(key);
      if (cached && cached.complete && cached.naturalWidth > 0) {
        ctx.drawImage(cached, screenX, screenY, TILE_SIZE, TILE_SIZE);
      } else if (!cached) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = getTileUrl(layer, z, wrappedTx, ty);
        tileCache.current.set(key, img);
        img.onload = () => tileCache.current.set(key, img);
        img.onerror = () => tileCache.current.delete(key);
      }
    }
  }
};

export const sizeCanvas = (container, ...canvases) => {
  if (!container) return;
  const { width, height } = container.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvases.forEach((c) => {
    if (!c) return;
    c.width = width * dpr;
    c.height = height * dpr;
    c.style.width = `${width}px`;
    c.style.height = `${height}px`;
    c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
  });
};

export const searchLocation = async (query) => {
  if (!query.trim()) return [];
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=us`;
  try {
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    const data = await res.json();
    return data.map((item) => ({
      name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch {
    return [];
  }
};
