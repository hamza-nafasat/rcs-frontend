import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_CENTER, PREVIEW_ZOOM, drawTiles, sizeCanvas } from "../utils/mapHelpers";
import AuthTerritoryDrawing from "./AuthTerritoryDrawing";
import { Check, MapPin, Maximize2 } from "lucide-react";

// ═════════════════════════════════════════════════════════════════════════════

const AuthLocationAssign = ({ onTerritoryChange }) => {
  const containerRef = useRef(null);
  const mapCanvasRef = useRef(null);
  const tileCache = useRef(new Map());

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const doResize = () => sizeCanvas(containerRef.current, mapCanvasRef.current);
    doResize();
    window.addEventListener("resize", doResize);
    return () => window.removeEventListener("resize", doResize);
  }, []);

  const paintPreview = useCallback(() => {
    const mc = mapCanvasRef.current;
    if (!mc) return;
    const ctx = mc.getContext("2d");
    const { width, height } = mc.getBoundingClientRect();
    drawTiles(ctx, width, height, DEFAULT_CENTER, PREVIEW_ZOOM, tileCache);
  }, []);

  useEffect(() => {
    paintPreview();
    const id = setInterval(paintPreview, 300);
    return () => clearInterval(id);
  }, [paintPreview]);

  const handleComplete = (completedAreas) => {
    setAreas(completedAreas);
    onTerritoryChange?.(completedAreas);
  };

  const totalAreaKm2 = areas.reduce((sum, a) => sum + (a.areaKm2 || 0), 0);

  return (
    <>
      <section className="rounded-xl border color-border overflow-hidden bg-white shadow-2xs">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 border-b color-border bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-revenue" />
            <span className="text-xs font-semibold text-tertiary uppercase tracking-wide">
              Territory Selection
            </span>
          </div>

          {areas.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-[11px] font-semibold text-green-700">
              <Check size={12} />
              {areas.length} Area{areas.length !== 1 ? "s" : ""} selected (
              {totalAreaKm2 < 1
                ? `${(totalAreaKm2 * 1000).toFixed(0)} m²`
                : `${totalAreaKm2.toFixed(1)} km²`}
              )
            </span>
          )}
        </div>

        {/* Map Preview Canvas */}
        <div ref={containerRef} className="relative" style={{ height: 240 }}>
          <canvas
            ref={mapCanvasRef}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />

          <div className="absolute bottom-3 right-3">
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer shadow-lg hover:opacity-90 transition"
            >
              <Maximize2 size={14} />
              {areas.length > 0 ? "Edit / Add Areas" : "Select Area"}
            </button>
          </div>
        </div>
      </section>

      {isFullscreen && (
        <AuthTerritoryDrawing
          onClose={() => setIsFullscreen(false)}
          onComplete={handleComplete}
          initialAreas={areas}
        />
      )}
    </>
  );
};

export default AuthLocationAssign;
