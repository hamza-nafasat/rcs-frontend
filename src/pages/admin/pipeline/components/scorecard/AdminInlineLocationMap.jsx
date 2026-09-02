import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Building2, Maximize2 } from "lucide-react";
import { INITIAL_BRANCHES } from "./AdminLocationAssignModal";

const TILE_SIZE = 256;

function lngToPixel(lng, zoom) {
  return ((lng + 180) / 360) * TILE_SIZE * Math.pow(2, zoom);
}

function latToPixel(lat, zoom) {
  const sin = Math.sin((lat * Math.PI) / 180);
  const y = 0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI);
  return y * TILE_SIZE * Math.pow(2, zoom);
}

const AdminInlineLocationMap = ({ applicant, onOpenFullMap }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [center, setCenter] = useState({ lat: 30.2672, lng: -97.7431 }); // default Austin, TX
  const [zoom] = useState(11);

  // Filter branches matching applicant's city or franchise
  const branches = applicant?.branches || INITIAL_BRANCHES;

  useEffect(() => {
    if (branches.length > 0) {
      setCenter({ lat: branches[0].lat, lng: branches[0].lng });
    }
  }, [branches]);

  const latLngToCanvas = useCallback(
    (lat, lng) => {
      const el = containerRef.current;
      if (!el) return { x: 0, y: 0 };
      const width = el.clientWidth;
      const height = el.clientHeight;

      const centerPxX = lngToPixel(center.lng, zoom);
      const centerPxY = latToPixel(center.lat, zoom);

      const ptPxX = lngToPixel(lng, zoom);
      const ptPxY = latToPixel(lat, zoom);

      return {
        x: width / 2 + (ptPxX - centerPxX),
        y: height / 2 + (ptPxY - centerPxY),
      };
    },
    [center, zoom],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    // Draw Assigned Branch Pins & Labels
    branches.forEach((branch) => {
      const px = latLngToCanvas(branch.lat, branch.lng);
      if (px.x < -60 || px.x > width + 60 || px.y < -60 || px.y > height + 60) return;

      // Exclusion radius circle
      if (branch.radiusKm > 0) {
        const radiusPx =
          (branch.radiusKm * 1000) /
          ((156543.03392 * Math.cos((branch.lat * Math.PI) / 180)) / Math.pow(2, zoom));

        ctx.beginPath();
        ctx.arc(px.x, px.y, radiusPx, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59, 130, 246, 0.08)";
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Branch Pin Badge
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;

      const pinRadius = 12;
      ctx.beginPath();
      ctx.arc(px.x, px.y, pinRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#1e293b";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // Building Icon
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(px.x - 5, px.y - 1);
      ctx.lineTo(px.x, px.y - 6);
      ctx.lineTo(px.x + 5, px.y - 1);
      ctx.fill();
      ctx.fillRect(px.x - 4, px.y - 1, 8, 6);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(px.x - 1, px.y + 2, 2, 3);
      ctx.restore();

      // Branch Name Label
      ctx.save();
      ctx.font = "bold 10px Inter, system-ui, sans-serif";
      const branchLabel = `${branch.name} (${branch.radiusKm} km)`;
      const labelW = ctx.measureText(branchLabel).width;
      const bW = labelW + 12;
      const bH = 18;
      const bX = px.x - bW / 2;
      const bY = px.y + pinRadius + 4;

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(bX, bY, bW, bH, 4);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#cbd5e1";
      ctx.stroke();

      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(branchLabel, px.x, bY + bH / 2);
      ctx.restore();
    });
  }, [branches, latLngToCanvas, zoom]);

  // Tiles calculations
  const numTiles = Math.pow(2, zoom);
  const centerPxX = lngToPixel(center.lng, zoom);
  const centerPxY = latToPixel(center.lat, zoom);

  const containerW = containerRef.current?.clientWidth || 360;
  const containerH = containerRef.current?.clientHeight || 180;

  const minTileX = Math.floor((centerPxX - containerW / 2) / TILE_SIZE);
  const maxTileX = Math.floor((centerPxX + containerW / 2) / TILE_SIZE);
  const minTileY = Math.floor((centerPxY - containerH / 2) / TILE_SIZE);
  const maxTileY = Math.floor((centerPxY + containerH / 2) / TILE_SIZE);

  const tiles = [];
  for (let tx = minTileX; tx <= maxTileX; tx++) {
    for (let ty = minTileY; ty <= maxTileY; ty++) {
      const wrappedTileX = ((tx % numTiles) + numTiles) % numTiles;
      if (ty >= 0 && ty < numTiles) {
        const left = containerW / 2 + tx * TILE_SIZE - centerPxX;
        const top = containerH / 2 + ty * TILE_SIZE - centerPxY;
        const url = `https://tile.openstreetmap.org/${zoom}/${wrappedTileX}/${ty}.png`;
        tiles.push({ key: `${tx}-${ty}-${zoom}`, left, top, url });
      }
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-orange-500" />
          <span className="text-xs font-bold text-gray-900">
            Assigned Branch Location Map
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenFullMap}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
        >
          <Maximize2 size={12} />
          Expand Map
        </button>
      </div>

      <div
        ref={containerRef}
        onClick={onOpenFullMap}
        className="relative h-44 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer group"
      >
        {/* Tile Grid */}
        <div className="absolute inset-0 pointer-events-none">
          {tiles.map((t) => (
            <img
              key={t.key}
              src={t.url}
              alt=""
              style={{
                position: "absolute",
                left: t.left,
                top: t.top,
                width: TILE_SIZE,
                height: TILE_SIZE,
              }}
              draggable={false}
            />
          ))}
        </div>

        {/* Canvas overlay for branch pins & labels */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

        {/* Overlay hover prompt */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition flex items-center justify-center z-20 pointer-events-none">
          <span className="bg-white/95 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md border border-gray-200">
            Click to Assign / Edit Branch Locations
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminInlineLocationMap;
