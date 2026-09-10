import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { calcBoundingBox, calcCentroid, calcPolygonAreaKm2, clearCanvas, drawAreaLabel, drawDot, fillPolygon, getCanvasPoint, isNearPoint, redrawPolygon, strokePolygon } from "../../../../utils/canvasDrawing";
import { AREA_COLORS, DEFAULT_CENTER, DRAG_THRESHOLD, FULLSCREEN_ZOOM, LAYER_SATELLITE, LAYER_STREET, MAX_ZOOM, MIN_ZOOM, TILE_SIZE, drawTiles, latToPixel, lngToPixel, pixelToLat, pixelToLng, searchLocation, sizeCanvas } from "../utils/mapHelpers";
import { Check, ChevronDown, ChevronUp, Layers, MapPin, PenTool, Pencil, RotateCcw, Search, Trash2, X } from "lucide-react";

// ═════════════════════════════════════════════════════════════════════════════
// FULLSCREEN MULTI-AREA OVERLAY
// ═════════════════════════════════════════════════════════════════════════════

const AuthTerritoryDrawing = ({ onClose, onComplete, initialAreas = [] }) => {
  const containerRef = useRef(null);
  const mapCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const tileCache = useRef(new Map());

  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(FULLSCREEN_ZOOM);
  const [mapLayer, setMapLayer] = useState(LAYER_STREET);

  // Completed areas & active drawing state
  const [completedAreas, setCompletedAreas] = useState(initialAreas);
  const [activeGeoPoints, setActiveGeoPoints] = useState([]);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [cursor, setCursor] = useState(null);

  // Save Area Form Modal State
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingGeoPoints, setPendingGeoPoints] = useState(null);
  const [editingAreaId, setEditingAreaId] = useState(null);
  const [formAreaName, setFormAreaName] = useState("");
  const [formAreaDistance, setFormAreaDistance] = useState("5");

  // Summary side panel & modal states
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [expandedAreaId, setExpandedAreaId] = useState(null);
  const [copiedAreaId, setCopiedAreaId] = useState(null);

  // Search state
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
    const doResize = () =>
      sizeCanvas(containerRef.current, mapCanvasRef.current, drawCanvasRef.current);
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

  // Redraw all areas & active drawing on the vector canvas layer
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
      pxPoints.forEach((p, idx) =>
        drawDot(ctx, p, { fill: color.stroke, stroke: "#ffffff", radius: 4 }),
      );

      // Area label at centroid
      const centroidGeo = calcCentroid(area.geoPoints);
      const centroidPx = latLngToCanvas(centroidGeo.lat, centroidGeo.lng);
      const displayLabel =
        area.distanceKm > 0 ? `${area.name} (${area.distanceKm} km)` : area.name;
      drawAreaLabel(ctx, centroidPx, displayLabel, color.stroke);
    });

    // 2. Draw currently active drawing area
    if (activeGeoPoints.length > 0) {
      const activePx = activeGeoPoints.map((g) => latLngToCanvas(g.lat, g.lng));
      const currentColor = AREA_COLORS[completedAreas.length % AREA_COLORS.length].stroke;
      const currentFill = AREA_COLORS[completedAreas.length % AREA_COLORS.length].fill;
      redrawPolygon(ctx, width, height, activePx, false, cursor, currentColor, currentFill);
    }
  }, [completedAreas, activeGeoPoints, cursor, latLngToCanvas]);

  // ── Scroll Zoom & Mac Touchpad Trackpad Handlers ──────────────────────────

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let pinchAccumulator = 0;
    let mouseWheelAccumulator = 0;
    let lastZoomTime = 0;

    const onWheel = (e) => {
      e.preventDefault();

      const now = Date.now();

      // 1. MAC TOUCHPAD PINCH-TO-ZOOM (e.ctrlKey === true)
      if (e.ctrlKey) {
        pinchAccumulator += e.deltaY;
        // Require 75px accumulated pinch delta AND at least 250ms delay between zoom steps
        if (Math.abs(pinchAccumulator) >= 75 && now - lastZoomTime > 250) {
          const deltaZoom = pinchAccumulator < 0 ? 1 : -1; // separating fingers = zoom in (+1), closing = zoom out (-1)
          setZoom((z) => Math.min(Math.max(z + deltaZoom, MIN_ZOOM), MAX_ZOOM));
          pinchAccumulator = 0;
          lastZoomTime = now;
        }
        return;
      }

      // 2. MOUSE SCROLL WHEEL ZOOM (vertical wheel scroll)
      const isMouseWheel =
        e.deltaMode === 1 || (Math.abs(e.deltaY) >= 50 && e.deltaX === 0);
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

      // 3. MAC TOUCHPAD TWO-FINGER PANNING (swiping 2 fingers side-to-side / up-down)
      // Very smooth, low speed panning multiplier (0.25x)
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

  // ── Pointer Handlers (Drag vs. Click to Draw) ──────────────────────────────

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

    if (isDrawingActive) {
      setCursor(getCanvasPoint(dc, e));
    } else {
      setCursor(null);
    }
  };

  const handlePointerUp = (e) => {
    const info = pointerDownInfo.current;
    pointerDownInfo.current = null;

    if (!info || info.isDragging) return;
    if (!isDrawingActive) return;

    const dc = drawCanvasRef.current;
    if (!dc) return;
    const pt = getCanvasPoint(dc, e);

    // Convert activeGeoPoints to pixel points for snapping check
    const pxPoints = activeGeoPoints.map((g) => latLngToCanvas(g.lat, g.lng));

    // Check if snapping to the first point to close the area
    if (pxPoints.length >= 3 && isNearPoint(pt, pxPoints[0])) {
      const defaultNum = completedAreas.length + 1;
      setPendingGeoPoints(activeGeoPoints);
      setFormAreaName(`Area #${defaultNum}`);
      setFormAreaDistance("5");
      setShowSaveModal(true);

      setActiveGeoPoints([]);
      setCursor(null);
      setIsDrawingActive(false);
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
    setIsDrawingActive(false);
    setCursor(null);
  };

  const handleToggleDrawMode = () => {
    if (isDrawingActive) {
      handleClearActive();
    } else {
      setIsDrawingActive(true);
    }
  };

  const handleDeleteArea = (id) => {
    setCompletedAreas((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAll = () => {
    setCompletedAreas([]);
    setActiveGeoPoints([]);
    setIsDrawingActive(false);
    setCursor(null);
  };

  const handleCloseModal = () => {
    handleClearActive();
    onClose();
  };

  const handleSaveAndExit = () => {
    onComplete(completedAreas);
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

  const handleEditAreaDetails = (area) => {
    setEditingAreaId(area.id);
    setPendingGeoPoints(area.geoPoints);
    setFormAreaName(area.name);
    setFormAreaDistance(area.distanceKm ? String(area.distanceKm) : "5");
    setShowSaveModal(true);
    setShowSummaryModal(false);
  };

  const handleEditAreaShape = (area) => {
    setEditingAreaId(area.id);
    setCompletedAreas((prev) => prev.filter((a) => a.id !== area.id));
    setActiveGeoPoints(area.geoPoints);
    setFormAreaName(area.name);
    setFormAreaDistance(area.distanceKm ? String(area.distanceKm) : "5");
    setIsDrawingActive(true);
    setShowSummaryModal(false);
  };

  const handleCopyAreaCoords = (area) => {
    const text = JSON.stringify(area.geoPoints, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAreaId(area.id);
      setTimeout(() => setCopiedAreaId(null), 2000);
    });
  };

  const handleCopyAllCoords = () => {
    const text = JSON.stringify(
      completedAreas.map((a) => ({ name: a.name, coordinates: a.geoPoints })),
      null,
      2,
    );
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAreaId("all");
      setTimeout(() => setCopiedAreaId(null), 2000);
    });
  };

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
            <h2 className="text-sm font-bold text-tertiary leading-tight">
              Select Territory Areas
            </h2>
            <p className="text-[11px] text-secondary">
              {completedAreas.length} Area{completedAreas.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        </div>

        {/* Location Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Search city, state, address (e.g. Austin, TX)..."
              className="w-full h-8.5 rounded-lg border color-border bg-white pl-9 pr-3 text-xs outline-none focus:border-[var(--color-primary)] transition"
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
                  <span className="text-tertiary leading-snug line-clamp-2">
                    {result.name}
                  </span>
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

          {completedAreas.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSummaryModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border color-border bg-white px-3 py-1.5 text-xs font-medium text-tertiary cursor-pointer hover:bg-gray-50 transition"
            >
              <Layers size={13} className="text-primary" />
              View Data
            </button>
          )}

          {/* Draw Button */}
          <button
            type="button"
            onClick={handleToggleDrawMode}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition ${isDrawingActive
              ? "bg-red-500 text-white shadow-xs"
              : "border color-border bg-white text-tertiary hover:bg-gray-50"
              }`}
            title={
              isDrawingActive
                ? "Click to stop drawing and clear in-progress dots"
                : "Click to start drawing a new territory area"
            }
          >
            <PenTool size={13} />
            {isDrawingActive ? "Stop Drawing" : "Draw"}
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSaveAndExit}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] text-white px-4 py-1.5 text-xs font-semibold cursor-pointer hover:opacity-90 transition"
          >
            <Check size={14} />
            Save
          </button>
        </div>
      </header>

      {/* ── Map Canvas Container ── */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          position: "relative",
          cursor: isDrawingActive ? "pointer" : "grab",
          touchAction: "none",
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <canvas
          ref={mapCanvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
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
            className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition ${mapLayer === LAYER_STREET
              ? "bg-[var(--color-primary)] text-white shadow-xs"
              : "text-secondary hover:text-tertiary"
              }`}
          >
            Street Map
          </button>
          <button
            type="button"
            onClick={() => setMapLayer(LAYER_SATELLITE)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition ${mapLayer === LAYER_SATELLITE
              ? "bg-[var(--color-primary)] text-white shadow-xs"
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
                  <p className="text-xs text-secondary">
                    Territory shape completed — enter area information
                  </p>
                </div>
              </div>
              <button
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
                  className="w-full h-10 rounded-xl border color-border bg-white px-3.5 text-sm outline-none focus:border-[var(--color-primary)] transition"
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
                    className="w-full h-10 rounded-xl border color-border bg-white pl-3.5 pr-14 text-sm font-semibold text-tertiary outline-none focus:border-[var(--color-primary)] transition"
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
                  className="flex-1 h-10 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer"
                >
                  Save Area Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── COORDINATES & MULTI-AREA SUMMARY MODAL ── */}
      {showSummaryModal && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 10000, background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSummaryModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ width: 540, maxHeight: "85vh" }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <div className="flex items-center gap-2.5">
                <Layers size={18} className="text-primary" />
                <div>
                  <h3 className="text-base font-bold text-tertiary">
                    Territory Coordinates Summary
                  </h3>
                  <p className="text-xs text-secondary">
                    {completedAreas.length} Area{completedAreas.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSummaryModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer transition text-secondary"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
              {completedAreas.length === 0 ? (
                <div className="py-12 text-center text-secondary text-sm">
                  No areas completed yet. Click &quot;Draw New Area&quot; to place points on the map.
                </div>
              ) : (
                completedAreas.map((area, index) => {
                  const color = AREA_COLORS[index % AREA_COLORS.length];
                  const isExpanded = expandedAreaId === area.id;

                  return (
                    <div
                      key={area.id}
                      className="rounded-xl border color-border overflow-hidden bg-white shadow-2xs"
                    >
                      {/* Area Card Header */}
                      <div
                        className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-gray-50/80 transition"
                        onClick={() =>
                          setExpandedAreaId(isExpanded ? null : area.id)
                        }
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0"
                            style={{ backgroundColor: color.stroke }}
                          />
                          <div>
                            <span className="text-sm font-bold text-tertiary">
                              {area.name}
                            </span>
                            <span className="ml-2 text-xs text-secondary">
                              ({area.geoPoints.length} vertices ·{" "}
                              {area.areaKm2 < 1
                                ? `${(area.areaKm2 * 1000).toFixed(0)} m²`
                                : `${area.areaKm2.toFixed(2)} km²`}
                              )
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {/* Single Edit button: Start editing from dots */}
                          <button
                            type="button"
                            onClick={() => handleEditAreaShape(area)}

                            className="p-1.5 rounded-lg  border border-orange-200 bg-orange-50 text-[var(--color-primary)] hover:bg-orange-100 cursor-pointer transition"
                            title="Edit area shape dots and details"
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteArea(area.id)}
                            className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer transition"
                            title="Delete this area"
                          >
                            <Trash2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpandedAreaId(isExpanded ? null : area.id)}
                            className="p-1.5 text-secondary hover:text-tertiary cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Coordinates List */}
                      {isExpanded && (
                        <div className="border-t color-border p-3 bg-gray-50/50 flex flex-col gap-2">
                          <p className="text-[11px] font-semibold text-secondary uppercase tracking-wide">
                            All Coordinates (Lat, Lng)
                          </p>
                          <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1">
                            {area.geoPoints.map((p, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 rounded-md bg-white border color-border px-2.5 py-1 text-xs"
                              >
                                <span
                                  className="w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: color.stroke }}
                                >
                                  {idx + 1}
                                </span>
                                <span className="font-mono text-tertiary">
                                  {p.lat.toFixed(5)}°, {p.lng.toFixed(5)}°
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              {completedAreas.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                >
                  Clear All Areas
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold cursor-pointer hover:opacity-90 transition"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// PREVIEW COMPONENT (Embedded in Form)

export default AuthTerritoryDrawing;
