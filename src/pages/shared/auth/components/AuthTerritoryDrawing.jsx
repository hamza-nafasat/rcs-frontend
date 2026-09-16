import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  calcBoundingBox,
  calcCentroid,
  calcPolygonAreaKm2,
  clearCanvas,
  drawAreaLabel,
  drawDot,
  fillPolygon,
  getCanvasPoint,
  isNearPoint,
  redrawPolygon,
  strokePolygon,
} from "../../../../utils/canvasDrawing";
import {
  AREA_COLORS,
  DEFAULT_CENTER,
  DRAG_THRESHOLD,
  FULLSCREEN_ZOOM,
  LAYER_SATELLITE,
  LAYER_STREET,
  MAX_ZOOM,
  MIN_ZOOM,
  TILE_SIZE,
  drawFranchisePin,
  drawTiles,
  latToPixel,
  lngToPixel,
  pixelToLat,
  pixelToLng,
  searchLocation,
  sizeCanvas,
} from "../utils/mapHelpers";
import { Check, Layers, MapPin, PenTool, RotateCcw, Search, Store, X } from "lucide-react";
import AuthFranchiseFormModal from "./AuthFranchiseFormModal";
import AuthMapDataModal from "./AuthMapDataModal";

const MODE_IDLE = "idle";
const MODE_AREA = "area";
const MODE_LOCATION = "location";
const EMPTY_FRANCHISE = { name: "", country: "United States", state: "", city: "" };

const AuthTerritoryDrawing = ({ onClose, onComplete, initialAreas = [], initialFranchises = [] }) => {
  const containerRef = useRef(null);
  const mapCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const tileCache = useRef(new Map());

  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(FULLSCREEN_ZOOM);
  const [mapLayer, setMapLayer] = useState(LAYER_STREET);

  // saved areas, franchises, active drawing
  const [completedAreas, setCompletedAreas] = useState(initialAreas);
  const [franchises, setFranchises] = useState(initialFranchises);
  const [activeGeoPoints, setActiveGeoPoints] = useState([]);
  const [mode, setMode] = useState(MODE_IDLE);
  const [cursor, setCursor] = useState(null);

  const isDrawingActive = mode === MODE_AREA;
  const isPlacingFranchise = mode === MODE_LOCATION;

  // the franchise form modal
  const [pendingFranchise, setPendingFranchise] = useState(null);
  const [editingFranchiseId, setEditingFranchiseId] = useState(null);
  const [franchiseForm, setFranchiseForm] = useState(EMPTY_FRANCHISE);

  // Save Area Form Modal State
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingGeoPoints, setPendingGeoPoints] = useState(null);
  const [editingAreaId, setEditingAreaId] = useState(null);
  const [formAreaName, setFormAreaName] = useState("");
  const [formAreaDistance, setFormAreaDistance] = useState("5");

  // the manage data modal
  const [showDataModal, setShowDataModal] = useState(false);

  // the place search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchTimeout = useRef(null);

  const pointerDownInfo = useRef(null);

  // ── Pixel ↔ LatLng Math ───────────────────────────────────────────────────

  const latLngToCanvas = useCallback(
    (lat, lng) => {
      const mc = mapCanvasRef.current;
      if (!mc) return { x: 0, y: 0 };
      const { width, height } = mc.getBoundingClientRect();
      const cx = lngToPixel(center.lng, zoom);
      const cy = latToPixel(center.lat, zoom);
      const offsetX = width / 2 - cx;
      const offsetY = height / 2 - cy;
      return {
        x: lngToPixel(lng, zoom) + offsetX,
        y: latToPixel(lat, zoom) + offsetY,
      };
    },
    [center, zoom],
  );

  const canvasToLatLng = useCallback(
    (px, py) => {
      const mc = mapCanvasRef.current;
      if (!mc) return { lat: 0, lng: 0 };
      const { width, height } = mc.getBoundingClientRect();
      const cx = lngToPixel(center.lng, zoom);
      const cy = latToPixel(center.lat, zoom);
      const offsetX = width / 2 - cx;
      const offsetY = height / 2 - cy;
      return {
        lat: pixelToLat(py - offsetY, zoom),
        lng: pixelToLng(px - offsetX, zoom),
      };
    },
    [center, zoom],
  );

  // ── Mount & Layout ────────────────────────────────────────────────────────

  useEffect(() => {
    const doResize = () => sizeCanvas(containerRef.current, mapCanvasRef.current, drawCanvasRef.current);
    doResize();
    window.addEventListener("resize", doResize);
    return () => window.removeEventListener("resize", doResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ── Canvas Paint Loop ─────────────────────────────────────────────────────

  const paintMapTiles = useCallback(() => {
    const mc = mapCanvasRef.current;
    if (!mc) return;
    const ctx = mc.getContext("2d");
    const { width, height } = mc.getBoundingClientRect();
    drawTiles(ctx, width, height, center, zoom, tileCache, mapLayer);
  }, [center, zoom, mapLayer]);

  useEffect(() => {
    paintMapTiles();
    const id = setInterval(paintMapTiles, 200);
    return () => clearInterval(id);
  }, [paintMapTiles]);

  // redraw areas and active drawing
  useEffect(() => {
    const dc = drawCanvasRef.current;
    if (!dc) return;
    const ctx = dc.getContext("2d");
    const { width, height } = dc.getBoundingClientRect();

    clearCanvas(ctx, width, height);

    // 1. Draw all completed areas
    completedAreas.forEach((area, index) => {
      const color = AREA_COLORS[index % AREA_COLORS.length];
      const pxPoints = area.geoPoints.map((g) => latLngToCanvas(g.lat, g.lng));

      fillPolygon(ctx, pxPoints, { color: color.fill });
      strokePolygon(ctx, pxPoints, { color: color.stroke, width: 2.5 });
      pxPoints.forEach((p) => drawDot(ctx, p, { fill: color.stroke, stroke: "#ffffff", radius: 4 }));

      // Area label at centroid
      const centroidGeo = calcCentroid(area.geoPoints);
      const centroidPx = latLngToCanvas(centroidGeo.lat, centroidGeo.lng);
      const displayLabel = area.distanceKm > 0 ? `${area.name} (${area.distanceKm} km)` : area.name;
      drawAreaLabel(ctx, centroidPx, displayLabel, color.stroke);
    });

    // saved franchise pins
    franchises.forEach((franchise) => {
      drawFranchisePin(ctx, latLngToCanvas(franchise.lat, franchise.lng), franchise.name);
    });

    // the pin follows the cursor
    if (isPlacingFranchise && cursor) {
      drawFranchisePin(ctx, cursor, "Click to drop", { color: "#ea580c", radius: 16 });
    }

    // 2. Draw currently active drawing area
    if (activeGeoPoints.length > 0) {
      const activePx = activeGeoPoints.map((g) => latLngToCanvas(g.lat, g.lng));
      const currentColor = AREA_COLORS[completedAreas.length % AREA_COLORS.length].stroke;
      const currentFill = AREA_COLORS[completedAreas.length % AREA_COLORS.length].fill;
      redrawPolygon(ctx, width, height, activePx, false, cursor, currentColor, currentFill);
    }
  }, [completedAreas, franchises, isPlacingFranchise, activeGeoPoints, cursor, latLngToCanvas]);

// scroll zoom and trackpad handlers

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let pinchAccumulator = 0;
    let mouseWheelAccumulator = 0;
    let lastZoomTime = 0;

    const onWheel = (e) => {
      e.preventDefault();

      const now = Date.now();

      // touchpad pinch to zoom
      if (e.ctrlKey) {
        pinchAccumulator += e.deltaY;
        // needs 75px and 250ms between steps
        if (Math.abs(pinchAccumulator) >= 75 && now - lastZoomTime > 250) {
          const deltaZoom = pinchAccumulator < 0 ? 1 : -1; // separating fingers = zoom in (+1), closing = zoom out (-1)
          setZoom((z) => Math.min(Math.max(z + deltaZoom, MIN_ZOOM), MAX_ZOOM));
          pinchAccumulator = 0;
          lastZoomTime = now;
        }
        return;
      }

      // mouse wheel zoom
      const isMouseWheel = e.deltaMode === 1 || (Math.abs(e.deltaY) >= 50 && e.deltaX === 0);
      if (isMouseWheel) {
        mouseWheelAccumulator += e.deltaY;
        if (Math.abs(mouseWheelAccumulator) >= 60 && now - lastZoomTime > 200) {
          const deltaZoom = mouseWheelAccumulator < 0 ? 1 : -1;
          setZoom((z) => Math.min(Math.max(z + deltaZoom, MIN_ZOOM), MAX_ZOOM));
          mouseWheelAccumulator = 0;
          lastZoomTime = now;
        }
        return;
      }

      // touchpad two finger panning
      const dx = e.deltaX * 0.25;
      const dy = e.deltaY * 0.25;
      const totalPx = TILE_SIZE * Math.pow(2, zoom);

      setCenter((prevCenter) => {
        const newLng = prevCenter.lng + (dx / totalPx) * 360;
        const oldPy = latToPixel(prevCenter.lat, zoom);
        const newLat = pixelToLat(oldPy + dy, zoom);
        return { lat: newLat, lng: newLng };
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoom]);

// pointer drag versus click

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    pointerDownInfo.current = {
      x: e.clientX,
      y: e.clientY,
      centerLat: center.lat,
      centerLng: center.lng,
    };
  };

  const handlePointerMove = (e) => {
    const dc = drawCanvasRef.current;
    if (!dc) return;

    const info = pointerDownInfo.current;
    if (info) {
      const dx = (e.clientX - info.x) * 0.65;
      const dy = (e.clientY - info.y) * 0.65;

      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        info.isDragging = true;
        const totalPx = TILE_SIZE * Math.pow(2, zoom);
        const newLng = info.centerLng - (dx / totalPx) * 360;
        const oldPy = latToPixel(info.centerLat, zoom);
        const newLat = pixelToLat(oldPy - dy, zoom);
        setCenter({ lat: newLat, lng: newLng });
      }
      return;
    }

    if (isDrawingActive || isPlacingFranchise) {
      setCursor(getCanvasPoint(dc, e));
    } else {
      setCursor(null);
    }
  };

  const handlePointerUp = (e) => {
    const info = pointerDownInfo.current;
    pointerDownInfo.current = null;

    if (!info || info.isDragging) return;

    const dc = drawCanvasRef.current;
    if (!dc) return;
    const pt = getCanvasPoint(dc, e);

    // drop a franchise where clicked
    if (isPlacingFranchise) {
      setPendingFranchise(canvasToLatLng(pt.x, pt.y));
      setEditingFranchiseId(null);
      setFranchiseForm(EMPTY_FRANCHISE);
      setMode(MODE_IDLE);
      setCursor(null);
      return;
    }

    if (!isDrawingActive) return;

    // geo points to pixels for snapping
    const pxPoints = activeGeoPoints.map((g) => latLngToCanvas(g.lat, g.lng));

    // snap to close the area
    if (pxPoints.length >= 3 && isNearPoint(pt, pxPoints[0])) {
      const defaultNum = completedAreas.length + 1;
      setPendingGeoPoints(activeGeoPoints);
      setFormAreaName(`Area #${defaultNum}`);
      setFormAreaDistance("5");
      setShowSaveModal(true);

      setActiveGeoPoints([]);
      setCursor(null);
      setMode(MODE_IDLE);
      return;
    }

    // Add point to active drawing
    const geo = canvasToLatLng(pt.x, pt.y);
    setActiveGeoPoints((prev) => [...prev, geo]);
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    const dc = drawCanvasRef.current;
    if (!dc) return;
    const pt = getCanvasPoint(dc, e);
    const clickGeo = canvasToLatLng(pt.x, pt.y);
    setCenter(clickGeo);
    setZoom((z) => Math.min(z + 1, MAX_ZOOM));
  };

  // ── Search Handlers ───────────────────────────────────────────────────────

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(searchTimeout.current);
    if (!val.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      const results = await searchLocation(val);
      setSearchResults(results);
      setShowResults(results.length > 0);
    }, 400);
  };

  const handleSelectResult = (result) => {
    setCenter({ lat: result.lat, lng: result.lng });
    setZoom(12);
    setSearchQuery(result.name.split(",")[0]);
    setShowResults(false);
  };

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleUndoPoint = () => {
    if (activeGeoPoints.length > 0) {
      setActiveGeoPoints((prev) => prev.slice(0, -1));
    }
  };

  const handleClearActive = () => {
    setActiveGeoPoints([]);
    setMode(MODE_IDLE);
    setCursor(null);
  };

  const handleToggleDrawMode = () => {
    if (isDrawingActive) handleClearActive();
    else setMode(MODE_AREA);
  };

  const handleTogglePlaceMode = () => {
    setMode((prev) => (prev === MODE_LOCATION ? MODE_IDLE : MODE_LOCATION));
    setCursor(null);
  };

  const handleDeleteArea = (id) => {
    setCompletedAreas((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAll = () => {
    setCompletedAreas([]);
    setFranchises([]);
    setActiveGeoPoints([]);
    setMode(MODE_IDLE);
    setCursor(null);
  };

  const handleSaveAndExit = () => {
    onComplete({ areas: completedAreas, franchises });
    onClose();
  };

  const handleConfirmSaveArea = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!pendingGeoPoints || pendingGeoPoints.length === 0) return;

    const areaNumber = completedAreas.length + 1;
    const finalName = formAreaName.trim() || `Area #${areaNumber}`;
    const finalDistance = parseFloat(formAreaDistance) || 0;

    const updatedArea = {
      id: editingAreaId || `area-${Date.now()}`,
      name: finalName,
      distanceKm: finalDistance,
      geoPoints: pendingGeoPoints,
      areaKm2: calcPolygonAreaKm2(pendingGeoPoints),
      centroid: calcCentroid(pendingGeoPoints),
      bbox: calcBoundingBox(pendingGeoPoints),
    };

    setCompletedAreas((prev) => {
      if (editingAreaId) {
        const exists = prev.some((a) => a.id === editingAreaId);
        if (exists) {
          return prev.map((a) => (a.id === editingAreaId ? updatedArea : a));
        }
      }
      return [...prev, updatedArea];
    });

    setEditingAreaId(null);
    setPendingGeoPoints(null);
    setShowSaveModal(false);
  };

  const handleEditAreaShape = (area) => {
    setEditingAreaId(area.id);
    setCompletedAreas((prev) => prev.filter((a) => a.id !== area.id));
    setActiveGeoPoints(area.geoPoints);
    setFormAreaName(area.name);
    setFormAreaDistance(area.distanceKm ? String(area.distanceKm) : "5");
    setMode(MODE_AREA);
    setShowDataModal(false);
  };

  const handleFranchiseFormChange = ({ target }) =>
    setFranchiseForm((prev) => ({ ...prev, [target.name]: target.value }));

  const handleCloseFranchiseForm = () => {
    setPendingFranchise(null);
    setEditingFranchiseId(null);
    setFranchiseForm(EMPTY_FRANCHISE);
  };

  const handleConfirmFranchise = (event) => {
    event.preventDefault();
    if (!pendingFranchise) return;

    const franchise = {
      ...franchiseForm,
      id: editingFranchiseId || `franchise-${Date.now()}`,
      name: franchiseForm.name.trim(),
      lat: pendingFranchise.lat,
      lng: pendingFranchise.lng,
    };

    setFranchises((prev) =>
      editingFranchiseId ? prev.map((item) => (item.id === editingFranchiseId ? franchise : item)) : [...prev, franchise],
    );
    handleCloseFranchiseForm();
  };

  const handleEditFranchise = (franchise) => {
    setEditingFranchiseId(franchise.id);
    setPendingFranchise({ lat: franchise.lat, lng: franchise.lng });
    setFranchiseForm({
      name: franchise.name,
      country: franchise.country,
      state: franchise.state,
      city: franchise.city,
    });
    setShowDataModal(false);
  };

  const handleDeleteFranchise = (id) => setFranchises((prev) => prev.filter((item) => item.id !== id));

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
      }}
    >
      {/* ── Top Navigation Header ── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 18px",
          borderBottom: "1px solid var(--color-border)",
          background: "#ffffff",
          zIndex: 20,
          gap: 14,
        }}
      >
        <div className="flex items-center gap-2.5 shrink-0">
          <MapPin size={18} className="text-revenue" />
          <div>
            <h2 className="text-sm font-bold text-tertiary leading-tight">Manage Franchises Details</h2>
            <p className="text-[11px] text-secondary">
              {franchises.length} franchise{franchises.length !== 1 ? "s" : ""} · {completedAreas.length} area
              {completedAreas.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Location Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Search city, state, address (e.g. Austin, TX)..."
              className="w-full h-8.5 rounded-lg border color-border bg-white pl-9 pr-3 text-xs outline-none focus:border-(--color-primary) transition"
            />
          </div>

          {showResults && (
            <div
              className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border color-border bg-white shadow-xl overflow-hidden"
              style={{ zIndex: 30 }}
            >
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full flex items-start gap-2.5 px-3 py-2 text-left text-xs hover:bg-gray-50 cursor-pointer transition border-b last:border-b-0 color-border"
                >
                  <MapPin size={13} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-tertiary leading-snug line-clamp-2">{result.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          {activeGeoPoints.length > 0 && (
            <button
              type="button"
              onClick={handleUndoPoint}
              className="inline-flex items-center gap-1.5 rounded-lg border color-border bg-white px-3 py-1.5 text-xs font-medium text-secondary cursor-pointer hover:bg-gray-50 transition"
            >
              <RotateCcw size={13} />
              Undo Point
            </button>
          )}

          {(franchises.length > 0 || completedAreas.length > 0) && (
            <button
              type="button"
              onClick={() => setShowDataModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border color-border bg-white px-3 py-1.5 text-xs font-medium text-tertiary cursor-pointer hover:bg-gray-50 transition"
            >
              <Layers size={13} className="text-primary" />
              Manage Data
            </button>
          )}

          {/* drop a franchise pin */}
          <button
            type="button"
            onClick={handleTogglePlaceMode}
            title="Click the map to drop a franchise"
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition ${
              isPlacingFranchise
                ? "bg-orange-600 text-white shadow-xs"
                : "border color-border bg-white text-tertiary hover:bg-gray-50"
            }`}
          >
            <Store size={13} />
            {isPlacingFranchise ? "Click Map To Drop" : "Add Location"}
          </button>

          {/* draw a territory polygon */}
          <button
            type="button"
            onClick={handleToggleDrawMode}
            title={isDrawingActive ? "Stop drawing and clear the points" : "Draw a new territory area"}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition ${
              isDrawingActive
                ? "bg-red-500 text-white shadow-xs"
                : "border color-border bg-white text-tertiary hover:bg-gray-50"
            }`}
          >
            <PenTool size={13} />
            {isDrawingActive ? "Stop Drawing" : "Draw Area"}
          </button>

          <button
            type="button"
            onClick={handleSaveAndExit}
            className="inline-flex items-center gap-1.5 rounded-lg bg-(--color-primary) text-white px-4 py-1.5 text-xs font-semibold cursor-pointer hover:opacity-90 transition"
          >
            <Check size={14} />
            Save Data
          </button>
        </div>
      </header>

      {/* ── Map Canvas Container ── */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          position: "relative",
          cursor: isDrawingActive || isPlacingFranchise ? "pointer" : "grab",
          touchAction: "none",
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <canvas ref={mapCanvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        <canvas
          ref={drawCanvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onDoubleClick={handleDoubleClick}
        />

        {/* Top-left floating status */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {isDrawingActive && (
            <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-3.5 py-1.5 text-xs font-semibold shadow-md">
              <PenTool size={13} />
              Drawing Mode Active
            </span>
          )}

          {isPlacingFranchise && (
            <span className="inline-flex items-center gap-2 rounded-lg bg-orange-600 text-white px-3.5 py-1.5 text-xs font-semibold shadow-md">
              <Store size={13} />
              Click the map to drop a franchise
            </span>
          )}

          {activeGeoPoints.length > 0 && (
            <span className="rounded-lg bg-white/95 backdrop-blur-xs border color-border px-3 py-1.5 text-[11px] font-medium text-tertiary shadow-sm">
              {activeGeoPoints.length} point{activeGeoPoints.length !== 1 ? "s" : ""} placed
              {activeGeoPoints.length >= 3 ? ", click near Point 1 to close" : ""}
            </span>
          )}
        </div>

        {/* Map Layer Switcher: Street Map vs Satellite */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl border color-border shadow-md z-10">
          <button
            type="button"
            onClick={() => setMapLayer(LAYER_STREET)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition ${
              mapLayer === LAYER_STREET
                ? "bg-(--color-primary) text-white shadow-xs"
                : "text-secondary hover:text-tertiary"
            }`}
          >
            Street Map
          </button>
          <button
            type="button"
            onClick={() => setMapLayer(LAYER_SATELLITE)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition ${
              mapLayer === LAYER_SATELLITE
                ? "bg-(--color-primary) text-white shadow-xs"
                : "text-secondary hover:text-tertiary"
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 1, MAX_ZOOM))}
            className="w-9 h-9 flex items-center justify-center rounded-lg border color-border bg-white text-base font-bold text-tertiary cursor-pointer shadow-md hover:bg-gray-50 transition"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 1, MIN_ZOOM))}
            className="w-9 h-9 flex items-center justify-center rounded-lg border color-border bg-white text-base font-bold text-tertiary cursor-pointer shadow-md hover:bg-gray-50 transition"
          >
            −
          </button>
        </div>
      </div>

      {/* ── SAVE AREA DETAILS FORM MODAL ── */}
      {showSaveModal && pendingGeoPoints && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 10000, background: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ width: 440, maxWidth: "100%" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b color-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-tertiary">Save Area Details</h3>
                  <p className="text-xs text-secondary">Territory shape completed — enter area information</p>
                </div>
              </div>
              <button
                aria-label="Close"
                type="button"
                onClick={() => {
                  setShowSaveModal(false);
                  setPendingGeoPoints(null);
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer text-secondary transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Field 1: Area Name */}
              <div>
                <label className="block text-xs font-semibold text-tertiary uppercase tracking-wide mb-1.5">
                  Area Name *
                </label>
                <input
                  type="text"
                  required
                  value={formAreaName}
                  onChange={(e) => setFormAreaName(e.target.value)}
                  placeholder="e.g. Downtown Territory"
                  className="w-full h-10 rounded-xl border color-border bg-white px-3.5 text-sm outline-none focus:border-(--color-primary) transition"
                />
              </div>

              {/* Field 2: Distance Field (Type Number with km suffix) */}
              <div>
                <label className="block text-xs font-semibold text-tertiary uppercase tracking-wide mb-1.5">
                  Distance Allowed between branches *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    required
                    min="0.1"
                    step="0.1"
                    value={formAreaDistance}
                    onChange={(e) => setFormAreaDistance(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full h-10 rounded-xl border color-border bg-white pl-3.5 pr-14 text-sm font-semibold text-tertiary outline-none focus:border-(--color-primary) transition"
                  />
                  <span className="absolute right-3 text-xs font-bold text-secondary bg-gray-100 px-2.5 py-1 rounded-md">
                    km
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  Each number represents distance in kilometers (e.g. 5 = 5 km radius)
                </p>
              </div>

              {/* Summary Metrics Card */}
              <div className="rounded-xl border color-border bg-gray-50/70 p-3.5 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] font-semibold text-secondary uppercase">Vertices</p>
                  <p className="text-sm font-bold text-tertiary mt-0.5">{pendingGeoPoints.length}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-secondary uppercase">Surface Area</p>
                  <p className="text-sm font-bold text-primary mt-0.5">
                    {calcPolygonAreaKm2(pendingGeoPoints) < 1
                      ? `${(calcPolygonAreaKm2(pendingGeoPoints) * 1000).toFixed(0)} m²`
                      : `${calcPolygonAreaKm2(pendingGeoPoints).toFixed(1)} km²`}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-secondary uppercase">Center</p>
                  <p className="text-[11px] font-semibold text-tertiary mt-0.5 leading-tight">
                    {calcCentroid(pendingGeoPoints).lat.toFixed(3)}°, {calcCentroid(pendingGeoPoints).lng.toFixed(3)}°
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSaveModal(false);
                    setPendingGeoPoints(null);
                  }}
                  className="flex-1 h-10 rounded-xl border color-border bg-white text-xs font-semibold text-cancel hover:bg-gray-50 transition cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSaveArea}
                  className="flex-1 h-10 rounded-xl bg-(--color-primary) text-white text-xs font-bold hover:opacity-90 transition cursor-pointer"
                >
                  Save Area Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* the franchise details form */}
      {pendingFranchise && (
        <AuthFranchiseFormModal
          form={franchiseForm}
          location={pendingFranchise}
          isEditing={Boolean(editingFranchiseId)}
          onChange={handleFranchiseFormChange}
          onSubmit={handleConfirmFranchise}
          onClose={handleCloseFranchiseForm}
        />
      )}

      {showDataModal && (
        <AuthMapDataModal
          franchises={franchises}
          areas={completedAreas}
          onEditFranchise={handleEditFranchise}
          onDeleteFranchise={handleDeleteFranchise}
          onEditArea={handleEditAreaShape}
          onDeleteArea={handleDeleteArea}
          onClearAll={handleClearAll}
          onClose={() => setShowDataModal(false)}
        />
      )}
    </div>,
    document.body,
  );
};

export default AuthTerritoryDrawing;
