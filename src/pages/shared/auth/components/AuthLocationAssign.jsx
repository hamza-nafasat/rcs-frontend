import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_CENTER, PREVIEW_ZOOM, drawTiles, sizeCanvas } from "../utils/mapHelpers";
import AuthTerritoryDrawing from "./AuthTerritoryDrawing";
import { Check, MapPin, Maximize2 } from "lucide-react";

const AuthLocationAssign = ({ onTerritoryChange }) => {
  const containerRef = useRef(null);
  const mapCanvasRef = useRef(null);
  const tileCache = useRef(new Map());

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [areas, setAreas] = useState([]);
  const [franchises, setFranchises] = useState([]);

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

  const handleComplete = (data) => {
    setAreas(data.areas);
    setFranchises(data.franchises);
    onTerritoryChange?.(data);
  };

  const hasData = franchises.length > 0 || areas.length > 0;

  return (
    <>
      <section className="rounded-xl border color-border overflow-hidden bg-white shadow-2xs">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 border-b color-border bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-revenue" />
            <span className="text-xs font-semibold text-tertiary uppercase tracking-wide">
              Manage Franchises Details
            </span>
          </div>

          {hasData && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-[11px] font-semibold text-green-700">
              <Check size={12} />
              {franchises.length} Franchise{franchises.length !== 1 ? "s" : ""} · {areas.length} Area
              {areas.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Map Preview Canvas */}
        <div ref={containerRef} className="relative" style={{ height: 240 }}>
          <canvas ref={mapCanvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

          <div className="absolute bottom-3 right-3">
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-(--color-primary) text-white px-4 py-2.5 text-xs font-semibold cursor-pointer shadow-lg hover:opacity-90 transition"
            >
              <Maximize2 size={14} />
              {hasData ? "Manage Franchises & Areas" : "Open Map"}
            </button>
          </div>
        </div>
      </section>

      {isFullscreen && (
        <AuthTerritoryDrawing
          onClose={() => setIsFullscreen(false)}
          onComplete={handleComplete}
          initialAreas={areas}
          initialFranchises={franchises}
        />
      )}
    </>
  );
};

export default AuthLocationAssign;
