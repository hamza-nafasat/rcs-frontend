import { useState } from "react";
import { Building2, ChevronDown, ChevronUp, Layers, MapPin, Pencil, Trash2, X } from "lucide-react";
import DeleteModal from "../../modals/DeleteModal";
import { AREA_COLORS } from "../../../utils/mapHelpers";

const TAB_FRANCHISES = "franchises";
const TAB_AREAS = "areas";

// area size in m² or km²
const formatArea = (areaKm2 = 0) =>
  areaKm2 < 1 ? `${(areaKm2 * 1000).toFixed(0)} m²` : `${areaKm2.toFixed(2)} km²`;

const MapDataModal = ({
  franchises = [],
  areas = [],
  canEdit = true,
  canEditAreas = true,
  canEditSavedFranchises = true,
  onEditFranchise,
  onDeleteFranchise,
  onEditArea,
  onDeleteArea,
  onClearAll,
  onClose,
}) => {
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB_FRANCHISES);
  const [expandedAreaId, setExpandedAreaId] = useState(null);

  const tabs = [
    { key: TAB_FRANCHISES, label: `Franchises (${franchises.length})` },
    { key: TAB_AREAS, label: `Areas (${areas.length})` },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 10000, background: "rgba(0,0,0,0.45)" }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ width: 560, maxWidth: "100%", maxHeight: "85vh" }}
      >
        <div className="flex items-center justify-between border-b color-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Layers size={18} className="text-primary" />
            <div>
              <h3 className="text-base font-bold text-tertiary">Manage Data</h3>
              <p className="text-xs text-secondary">
                {franchises.length} franchise{franchises.length !== 1 ? "s" : ""} · {areas.length} area
                {areas.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            aria-label="Close"
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-1.5 text-secondary transition hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b color-border px-5 pt-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`cursor-pointer rounded-t-lg px-4 py-2 text-xs font-semibold transition ${
                activeTab === tab.key
                  ? "border-b-2 border-(--color-primary) text-primary"
                  : "text-secondary hover:text-tertiary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
          {activeTab === TAB_FRANCHISES &&
            (franchises.length === 0 ? (
              <p className="py-12 text-center text-sm text-secondary">
                No franchises yet. Use &quot;Add Location&quot; to drop one on the map.
              </p>
            ) : (
              franchises.map((franchise) => (
                <div
                  key={franchise.id}
                  className="flex items-center justify-between gap-3 rounded-xl border color-border bg-white p-3.5 shadow-2xs"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Building2 size={16} className="shrink-0 text-slate-700" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-tertiary">{franchise.name}</p>
                      <p className="text-[11px] text-secondary">
                        {[franchise.city, franchise.state].filter(Boolean).join(", ")} ·{" "}
                        {franchise.lat.toFixed(4)}°, {franchise.lng.toFixed(4)}°
                      </p>
                    </div>
                  </div>

                  {canEdit && (canEditSavedFranchises || !franchise._id) && (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditFranchise(franchise)}
                        title="Edit franchise details"
                        className="cursor-pointer rounded-lg border border-orange-200 bg-orange-50 p-1.5 text-(--color-primary) transition hover:bg-orange-100"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteFranchise(franchise.id)}
                        title="Delete this franchise"
                        className="cursor-pointer rounded-lg border border-red-200 p-1.5 text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ))}

          {activeTab === TAB_AREAS &&
            (areas.length === 0 ? (
              <p className="py-12 text-center text-sm text-secondary">
                No areas yet. Use &quot;Draw Area&quot; to place points on the map.
              </p>
            ) : (
              areas.map((area, index) => {
                const color = AREA_COLORS[index % AREA_COLORS.length];
                const isExpanded = expandedAreaId === area.id;

                return (
                  <div key={area.id} className="overflow-hidden rounded-xl border color-border bg-white shadow-2xs">
                    <div
                      className="flex cursor-pointer items-center justify-between gap-3 p-3.5 transition hover:bg-gray-50/80"
                      onClick={() => setExpandedAreaId(isExpanded ? null : area.id)}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ backgroundColor: color.stroke }} />
                        <div>
                          <span className="text-sm font-bold text-tertiary">{area.name}</span>
                          <span className="ml-2 text-xs text-secondary">
                            ({area.geoPoints.length} vertices · {formatArea(area.areaKm2)})
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5" onClick={(event) => event.stopPropagation()}>
                        {canEdit && canEditAreas && (
                          <>
                            <button
                              type="button"
                              onClick={() => onEditArea(area)}
                              title="Edit area shape and details"
                              className="cursor-pointer rounded-lg border border-orange-200 bg-orange-50 p-1.5 text-(--color-primary) transition hover:bg-orange-100"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteArea(area.id)}
                              title="Delete this area"
                              className="cursor-pointer rounded-lg border border-red-200 p-1.5 text-red-500 transition hover:bg-red-50"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          aria-label={isExpanded ? "Collapse coordinates" : "Expand coordinates"}
                          onClick={() => setExpandedAreaId(isExpanded ? null : area.id)}
                          className="cursor-pointer p-1.5 text-secondary hover:text-tertiary"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="flex flex-col gap-2 border-t color-border bg-gray-50/50 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-secondary">
                          All Coordinates (Lat, Lng)
                        </p>
                        <div className="grid max-h-48 grid-cols-1 gap-1.5 sm:grid-cols-2 overflow-y-auto p-1">
                          {area.geoPoints.map((point, pointIndex) => (
                            <div
                              key={pointIndex}
                              className="flex items-center gap-2 rounded-md border color-border bg-white px-2.5 py-1 text-xs"
                            >
                              <span
                                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                                style={{ backgroundColor: color.stroke }}
                              >
                                {pointIndex + 1}
                              </span>
                              <span className="font-mono text-tertiary">
                                {point.lat.toFixed(5)}°, {point.lng.toFixed(5)}°
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ))}
        </div>

        <div className="flex items-center justify-between border-t color-border px-5 py-3.5">
          {canEdit && canEditAreas && (franchises.length > 0 || areas.length > 0) ? (
            <button
              type="button"
              onClick={() => setIsClearConfirmOpen(true)}
              className="cursor-pointer text-xs font-semibold text-red-600 hover:underline"
            >
              Clear All Data
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <MapPin size={12} />
              Nothing saved yet
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-(--color-primary) px-5 py-2 text-xs font-semibold text-white transition hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>

      <DeleteModal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={() => {
          onClearAll();
          setIsClearConfirmOpen(false);
        }}
        heading="Clear All Data"
        text="Are you sure you want to clear every franchise and area from the map? This action cannot be undone."
        confirmText="Clear"
        className="z-10001"
      />
    </div>
  );
};

export default MapDataModal;
