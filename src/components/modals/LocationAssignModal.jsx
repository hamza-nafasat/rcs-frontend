import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, Building2, MapPin, X, AlertTriangle, Pencil, Trash2, List, HousePlus } from "lucide-react";
import Input from "../shared/Input";
import {
  LAYER_SATELLITE,
  LAYER_STREET,
  MAX_ZOOM,
  MIN_ZOOM,
  TILE_SIZE,
  getDistanceKm,
  latToPixel,
  lngToPixel,
  pixelToLat,
  pixelToLng,
  searchLocation,
} from "../../utils/mapHelpers";
import { INITIAL_BRANCHES } from "./locationBranches";

const findConflictAt = (point, branches) => {
  for (const branch of branches) {
    const dist = getDistanceKm(point.lat, point.lng, branch.lat, branch.lng);
    if (dist <= branch.radiusKm) return { branch, distanceKm: dist };
  }

  return null;
};

const LocationAssignModal = ({ isOpen, applicant, onClose, onSaveLocation }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // the map view state
  const [center, setCenter] = useState({ lat: 30.2672, lng: -97.7431 }); // default Austin, TX
  const [zoom, setZoom] = useState(11);
  // size in state, never a ref
  const [size, setSize] = useState({ width: 1000, height: 700 });
  const [mapLayer, setMapLayer] = useState(LAYER_STREET);

  // the saved branch state
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [isPlacingBranch, setIsPlacingBranch] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [conflictToast, setConflictToast] = useState(null);
  const [showBranchListModal, setShowBranchListModal] = useState(false);

  // the place search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchTimeout = useRef(null);

  // Save/Edit Branch Modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [pendingBranchLocation, setPendingBranchLocation] = useState(null);
  const [formBranchName, setFormBranchName] = useState("");
  const [formBranchDistance, setFormBranchDistance] = useState("5");

  // the map drag state
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragStartCenter = useRef({ lat: 0, lng: 0 });
  const pointerDownInfo = useRef({ x: 0, y: 0, centerLat: 0, centerLng: 0 });

  // centre on the applicant city
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () =>
      setSize({
        width: el.clientWidth || 1000,
        height: el.clientHeight || 700,
      });

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, [isOpen]);

  useEffect(() => {
    if (applicant?.territory) {
      searchLocation(applicant.territory).then((results) => {
        if (results.length > 0) {
          setCenter({ lat: results[0].lat, lng: results[0].lng });
          setZoom(11);
        }
      });
    }
  }, [applicant]);

  // pixels to coordinates
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

  const canvasToLatLng = useCallback(
    (x, y) => {
      const { width, height } = size;

      const centerPxX = lngToPixel(center.lng, zoom);
      const centerPxY = latToPixel(center.lat, zoom);

      const ptPxX = centerPxX + (x - width / 2);
      const ptPxY = centerPxY + (y - height / 2);

      return {
        lat: pixelToLat(ptPxY, zoom),
        lng: pixelToLng(ptPxX, zoom),
      };
    },
    [center, zoom, size],
  );

  // branch pairs whose radii overlap
  const overlappingBranchIds = useMemo(() => {
    const ids = new Set();

    for (let i = 0; i < branches.length; i++) {
      for (let j = i + 1; j < branches.length; j++) {
        const b1 = branches[i];
        const b2 = branches[j];
        const dist = getDistanceKm(b1.lat, b1.lng, b2.lat, b2.lng);

        if (dist < b1.radiusKm || dist < b2.radiusKm || dist < b1.radiusKm + b2.radiusKm) {
          ids.add(b1.id);
          ids.add(b2.id);
        }
      }
    }

    return ids;
  }, [branches]);

  // the conflict under the cursor
  const activeConflict =
    cursor && isPlacingBranch ? findConflictAt(canvasToLatLng(cursor.x, cursor.y), branches) : null;

  // preview a radius edit conflict
  const liveFormRadius = parseFloat(formBranchDistance) || 0;
  let liveFormConflict = null;

  if (showSaveModal && liveFormRadius > 0) {
    const targetLat = pendingBranchLocation
      ? pendingBranchLocation.lat
      : editingBranchId
        ? branches.find((b) => b.id === editingBranchId)?.lat
        : 0;
    const targetLng = pendingBranchLocation
      ? pendingBranchLocation.lng
      : editingBranchId
        ? branches.find((b) => b.id === editingBranchId)?.lng
        : 0;

    if (targetLat && targetLng) {
      for (const other of branches) {
        if (editingBranchId && other.id === editingBranchId) continue;
        const dist = getDistanceKm(targetLat, targetLng, other.lat, other.lng);
        if (dist <= liveFormRadius || dist <= other.radiusKm || dist < liveFormRadius + other.radiusKm) {
          liveFormConflict = { other, dist };
          break;
        }
      }
    }
  }

// draw the map and pins

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

    // draw the saved branches
    branches.forEach((branch) => {
      const px = latLngToCanvas(branch.lat, branch.lng);
      if (px.x < -100 || px.x > width + 100 || px.y < -100 || px.y > height + 100) return;

      const isCursorConflict = activeConflict && activeConflict.branch.id === branch.id;
      const isOverlapConflict = overlappingBranchIds.has(branch.id);
      const isConflict = isCursorConflict || isOverlapConflict;

      // the radius circle, red on conflict
      if (branch.radiusKm > 0) {
        const radiusPx =
          (branch.radiusKm * 1000) / ((156543.03392 * Math.cos((branch.lat * Math.PI) / 180)) / Math.pow(2, zoom));

        ctx.beginPath();
        ctx.arc(px.x, px.y, radiusPx, 0, Math.PI * 2);

        if (isConflict) {
          // RED warning circle for surpassing/overlapping radius
          ctx.fillStyle = "rgba(239, 68, 68, 0.28)";
          ctx.fill();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = "#ef4444";
          ctx.setLineDash([]);
          ctx.stroke();
        } else {
          // Normal blue radius circle
          ctx.fillStyle = "rgba(59, 130, 246, 0.08)";
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw Branch Pin Icon Badge
      ctx.save();
      ctx.shadowColor = isConflict ? "rgba(239,68,68,0.5)" : "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;

      const pinRadius = 14;
      ctx.beginPath();
      ctx.arc(px.x, px.y, pinRadius, 0, Math.PI * 2);
      ctx.fillStyle = isConflict ? "#dc2626" : "#1e293b"; // RED pin if conflict, dark slate otherwise
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // the branch building icon
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(px.x - 6, px.y - 1);
      ctx.lineTo(px.x, px.y - 7);
      ctx.lineTo(px.x + 6, px.y - 1);
      ctx.fill();
      ctx.fillRect(px.x - 5, px.y - 1, 10, 7);
      ctx.fillStyle = isConflict ? "#dc2626" : "#1e293b";
      ctx.fillRect(px.x - 1.5, px.y + 2, 3, 4);

      ctx.restore();

      // Draw Branch Name Text Label Badge
      ctx.save();
      ctx.font = "bold 11px Inter, system-ui, sans-serif";

      const branchLabel = isOverlapConflict
        ? `⚠️ OVERLAP: ${branch.name} (${branch.radiusKm} km)`
        : isCursorConflict
          ? `⚠️ CONFLICT: ${branch.name} (${branch.radiusKm} km)`
          : `${branch.name} (${branch.radiusKm} km)`;

      const labelW = ctx.measureText(branchLabel).width;
      const padX = 8;
      const bW = labelW + padX * 2;
      const bH = 20;
      const bX = px.x - bW / 2;
      const bY = px.y + pinRadius + 5;

      ctx.shadowColor = isConflict ? "rgba(239,68,68,0.4)" : "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = isConflict ? "#fef2f2" : "#ffffff";
      ctx.beginPath();
      ctx.roundRect(bX, bY, bW, bH, 5);
      ctx.fill();

      ctx.lineWidth = isConflict ? 1.5 : 1;
      ctx.strokeStyle = isConflict ? "#ef4444" : "#cbd5e1";
      ctx.stroke();

      ctx.fillStyle = isConflict ? "#991b1b" : "#0f172a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(branchLabel, px.x, bY + bH / 2);
      ctx.restore();
    });

    // the pin that follows the cursor
    if (isPlacingBranch && cursor) {
      const isConflict = !!activeConflict;

      ctx.save();
      ctx.shadowColor = isConflict ? "rgba(239, 68, 68, 0.6)" : "rgba(234, 88, 12, 0.4)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;

      // red on conflict, orange when clean
      const floatRadius = 16;
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, floatRadius, 0, Math.PI * 2);
      ctx.fillStyle = isConflict ? "#ef4444" : "#ea580c";
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // Store/Building Icon inside floating pin
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(cursor.x - 7, cursor.y - 1);
      ctx.lineTo(cursor.x, cursor.y - 8);
      ctx.lineTo(cursor.x + 7, cursor.y - 1);
      ctx.fill();
      ctx.fillRect(cursor.x - 6, cursor.y - 1, 12, 8);
      ctx.fillStyle = isConflict ? "#ef4444" : "#ea580c";
      ctx.fillRect(cursor.x - 2, cursor.y + 2, 4, 5);

      ctx.restore();

      // the helper badge by the cursor
      ctx.save();
      ctx.font = "bold 11px Inter, system-ui, sans-serif";
      const helperText = isConflict ? `⚠️ CANNOT ADD HERE!` : `Click on map`;

      const textW = ctx.measureText(helperText).width;
      const badgeW = textW + 16;
      const badgeH = 22;

      ctx.fillStyle = isConflict ? "#dc2626" : "rgba(15, 23, 42, 0.9)";
      ctx.beginPath();
      ctx.roundRect(cursor.x + 22, cursor.y - 11, badgeW, badgeH, 6);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(helperText, cursor.x + 22 + badgeW / 2, cursor.y);
      ctx.restore();
    }
  }, [branches, isPlacingBranch, cursor, activeConflict, overlappingBranchIds, latLngToCanvas, zoom]);

// wheel zoom and trackpad pan

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let pinchAccumulator = 0;
    let lastZoomTime = 0;

    const onWheel = (e) => {
      e.preventDefault();
      const now = Date.now();

      if (e.ctrlKey) {
        pinchAccumulator += e.deltaY;
        if (Math.abs(pinchAccumulator) >= 75 && now - lastZoomTime > 250) {
          const deltaZoom = pinchAccumulator < 0 ? 1 : -1;
          setZoom((z) => Math.min(Math.max(z + deltaZoom, MIN_ZOOM), MAX_ZOOM));
          pinchAccumulator = 0;
          lastZoomTime = now;
        }
        return;
      }

      // trackpad two finger panning
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

  // ── Pointer Handlers ──────────────────────────────────────────────────────

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    pointerDownInfo.current = {
      x: e.clientX,
      y: e.clientY,
      centerLat: center.lat,
      centerLng: center.lng,
    };
    isDragging.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragStartCenter.current = { lat: center.lat, lng: center.lng };
  };

  const handlePointerMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (e.buttons !== 1) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      isDragging.current = true;
    }

    if (isDragging.current) {
      const startPxX = lngToPixel(dragStartCenter.current.lng, zoom);
      const startPxY = latToPixel(dragStartCenter.current.lat, zoom);

      const newCenterPxX = startPxX - dx;
      const newCenterPxY = startPxY - dy;

      setCenter({
        lat: pixelToLat(newCenterPxY, zoom),
        lng: pixelToLng(newCenterPxX, zoom),
      });
    }
  };

  const handlePointerUp = (e) => {
    const moveDist = Math.hypot(e.clientX - pointerDownInfo.current.x, e.clientY - pointerDownInfo.current.y);

    if (moveDist < 6 && isPlacingBranch) {
      if (activeConflict) {
        setConflictToast(
          `Location Conflict! Cannot add a branch inside the ${activeConflict.branch.radiusKm} km radius of "${activeConflict.branch.name}".`,
        );
        setTimeout(() => setConflictToast(null), 4000);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const geo = canvasToLatLng(clickX, clickY);

      // saved under the franchise name
      const branchName = applicant?.franchise || applicant?.name || "Branch";
      const newBranch = {
        id: `branch-${Date.now()}`,
        name: branchName,
        franchise: applicant?.franchise || "Franchise",
        city: applicant?.territory || "Austin, TX",
        lat: geo.lat,
        lng: geo.lng,
        radiusKm: 5,
      };

      const updated = [...branches, newBranch];
      setBranches(updated);
      onSaveLocation?.(updated);
      setIsPlacingBranch(false);

      setConflictToast(` assigned & saved successfully!`);
      setTimeout(() => setConflictToast(null), 3000);
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const clickGeo = canvasToLatLng(clickX, clickY);

    setCenter(clickGeo);
    setZoom((z) => Math.min(z + 1, MAX_ZOOM));
  };

  // Branch Editing Handlers
  const handleEditBranch = (branch) => {
    setEditingBranchId(branch.id);
    setPendingBranchLocation({ lat: branch.lat, lng: branch.lng });
    setFormBranchName(branch.name);
    setFormBranchDistance(String(branch.radiusKm));
    setShowSaveModal(true);
    setShowBranchListModal(false);
  };

  const handleDeleteBranch = (branchId) => {
    const updated = branches.filter((b) => b.id !== branchId);
    setBranches(updated);
    onSaveLocation?.(updated);
  };

  const handleSaveBranchConfirm = (e) => {
    e.preventDefault();

    if (editingBranchId) {
      const updated = branches.map((b) =>
        b.id === editingBranchId
          ? {
              ...b,
              name: formBranchName.trim() || b.name,
              radiusKm: parseFloat(formBranchDistance) || b.radiusKm,
            }
          : b,
      );
      setBranches(updated);
      onSaveLocation?.(updated);
    } else if (pendingBranchLocation) {
      const newBranch = {
        id: `branch-${Date.now()}`,
        name: formBranchName.trim() || "New Branch",
        franchise: applicant?.franchise || "Franchise",
        city: applicant?.territory || "Austin, TX",
        lat: pendingBranchLocation.lat,
        lng: pendingBranchLocation.lng,
        radiusKm: parseFloat(formBranchDistance) || 5,
      };

      const updated = [...branches, newBranch];
      setBranches(updated);
      onSaveLocation?.(updated);
    }

    setEditingBranchId(null);
    setPendingBranchLocation(null);
    setShowSaveModal(false);
  };

  // Search input handler
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

  if (!isOpen) return null;

  // Render tile grid URLs
  const numTiles = Math.pow(2, zoom);
  const centerPxX = lngToPixel(center.lng, zoom);
  const centerPxY = latToPixel(center.lat, zoom);

  const containerW = size.width;
  const containerH = size.height;

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
        const url =
          mapLayer === LAYER_SATELLITE
            ? `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${ty}/${wrappedTileX}`
            : `https://tile.openstreetmap.org/${zoom}/${wrappedTileX}/${ty}.png`;

        tiles.push({ key: `${tx}-${ty}-${zoom}-${mapLayer}`, left, top, url });
      }
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
      {/* Top Navigation Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white z-20 gap-4">
        {/* Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-tight">
              Assign Location | {applicant?.name || "Applicant"}
            </h2>
            <p className="text-xs text-gray-500">{applicant?.franchise || "Franchise"}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Input
            iconPosition="left"
            icon={<Search size={14} />}
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            placeholder="Search..."
            className="w-full h-9 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-(--color-primary) transition"
          />

          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden z-30">
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full flex items-start gap-2.5 px-3 py-2 text-left text-xs hover:bg-gray-50 cursor-pointer transition border-b last:border-b-0 border-gray-100"
                >
                  <MapPin size={13} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-gray-800 line-clamp-2">{result.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowBranchListModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 cursor-pointer transition"
          >
            <List size={14} />
            Manage
          </button>

          <button
            type="button"
            onClick={() => setIsPlacingBranch((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition ${
              isPlacingBranch
                ? "bg-orange-600 text-white shadow-xs"
                : "border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
            }`}
          >
            <HousePlus size={14} />
            {isPlacingBranch ? "Adding Branch (Click map to place)" : "Add"}
          </button>

          <button
            aria-label="Close"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer transition text-gray-500"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* ── Map Canvas Viewport ── */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        className={`relative flex-1 bg-gray-100 overflow-hidden select-none ${
          isPlacingBranch ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
        }`}
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

        {/* Canvas overlay for drawing & branch markers */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

        {/* Conflict Toast Alert Banner */}
        {conflictToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold animate-bounce">
            <AlertTriangle size={16} />
            <span>{conflictToast}</span>
          </div>
        )}

        {/* Informational Banner */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-gray-200 shadow-md text-xs">
          <Building2 size={15} className="text-slate-800" />
          <span className="font-semibold text-gray-800">Saved Branches</span>
          {overlappingBranchIds.size > 0 && (
            <span className="ml-2 text-red-600 font-bold animate-pulse">
              ⚠️ {overlappingBranchIds.size} Branches have surpassing/overlapping radii!
            </span>
          )}
        </div>

        {/* Layer Switcher */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl border border-gray-200 shadow-md z-20">
          <button
            type="button"
            onClick={() => setMapLayer(LAYER_STREET)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition ${
              mapLayer === LAYER_STREET
                ? "bg-(--color-primary) text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
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
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-20">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 1, MAX_ZOOM))}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-base font-bold text-gray-700 cursor-pointer shadow-md hover:bg-gray-50 transition"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 1, MIN_ZOOM))}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-base font-bold text-gray-700 cursor-pointer shadow-md hover:bg-gray-50 transition"
          >
            −
          </button>
        </div>
      </div>

      {/* ── Manage Branches Modal ── */}
      {showBranchListModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setShowBranchListModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-lg flex flex-col gap-4 border border-gray-200 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Manage Saved Branches ({branches.length})</h3>
                <p className="text-xs text-gray-500">
                  Edit branch names, radius distances, or remove branch locations.
                </p>
              </div>
              <button
                aria-label="Close panel"
                type="button"
                onClick={() => setShowBranchListModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1">
              {branches.map((b) => {
                const hasOverlap = overlappingBranchIds.has(b.id);
                return (
                  <div
                    key={b.id}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      hasOverlap ? "border-red-300 bg-red-50/60" : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 size={16} className={hasOverlap ? "text-red-600" : "text-slate-700"} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">{b.name}</span>
                          {hasOverlap && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
                              Radius Overlap Conflict
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500">
                          {b.city} · {b.radiusKm} km radius
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEditBranch(b)}
                        className="p-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-semibold cursor-pointer transition flex items-center gap-1"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBranch(b.id)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer transition"
                        title="Delete branch"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Save/Edit Branch Details Modal ── */}
      {showSaveModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4 border border-gray-200">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {editingBranchId ? "Edit Branch Details" : "Save New Branch"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {editingBranchId
                  ? "Update branch name or change radius distance (in km)."
                  : "Enter details for this new branch location."}
              </p>
            </div>

            {liveFormConflict && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                <AlertTriangle size={15} className="shrink-0 text-red-600 mt-0.5" />
                <span>
                  <strong>⚠️ Radius Surpass Warning:</strong> This radius ({liveFormRadius} km) surpasses/overlaps with{" "}
                  <strong>&quot;{liveFormConflict.other.name}&quot;</strong> (distance is{" "}
                  {liveFormConflict.dist.toFixed(1)} km).
                </span>
              </div>
            )}

            <form onSubmit={handleSaveBranchConfirm} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Branch Name *</label>
                <input
                  type="text"
                  required
                  value={formBranchName}
                  onChange={(e) => setFormBranchName(e.target.value)}
                  placeholder="e.g. Austin East Branch"
                  className="w-full h-9 rounded-lg border border-gray-200 px-3 text-xs outline-none focus:border-(--color-primary) transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Distance Allowed between branches *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={formBranchDistance}
                    onChange={(e) => setFormBranchDistance(e.target.value)}
                    className={`w-full h-9 rounded-lg border pl-3 pr-10 text-xs outline-none transition ${
                      liveFormConflict
                        ? "border-red-400 bg-red-50/30 text-red-900"
                        : "border-gray-200 focus:border-(--color-primary)"
                    }`}
                  />
                  <span className="absolute right-3 text-xs font-semibold text-gray-400">km</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSaveModal(false);
                    setEditingBranchId(null);
                  }}
                  className="flex-1 h-9 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-9 rounded-lg bg-(--color-primary) text-white text-xs font-bold hover:opacity-90 cursor-pointer transition"
                >
                  {editingBranchId ? "Update Branch" : "Save Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
};

export default LocationAssignModal;
