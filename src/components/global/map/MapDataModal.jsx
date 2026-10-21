import { useState } from "react";
import { Building2, CircleDot, Layers, MapPin, Pencil, Ruler, Trash2, X } from "lucide-react";
import DeleteModal from "../../modals/DeleteModal";
import { AREA_COLORS, circleAreaKm2 } from "../../../utils/mapHelpers";
import { formatAreaSize, formatMiles } from "../../../utils/distance";

const TAB_FRANCHISES = "franchises";
const TAB_AREAS = "areas";

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

const coordinates = (lat, lng) => (lat == null || lng == null ? "—" : `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`);

// one labelled number in a card
const Stat = ({ icon: Icon, label, value }) => (
  <div className="min-w-0">
    <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-secondary">
      {Icon && <Icon size={10} className="shrink-0" />}
      {label}
    </p>
    <p className="mt-0.5 truncate text-xs font-semibold text-tertiary">{value}</p>
  </div>
);

const RowActions = ({ onEdit, onDelete, editTitle, deleteTitle }) => (
  <div className="flex shrink-0 items-center gap-1.5">
    <button
      type="button"
      onClick={onEdit}
      title={editTitle}
      className="cursor-pointer rounded-lg border border-orange-200 bg-orange-50 p-1.5 text-(--color-primary) transition hover:bg-orange-100"
    >
      <Pencil size={13} />
    </button>
    <button
      type="button"
      onClick={onDelete}
      title={deleteTitle}
      className="cursor-pointer rounded-lg border border-red-200 p-1.5 text-red-500 transition hover:bg-red-50"
    >
      <Trash2 size={13} />
    </button>
  </div>
);

const EmptyState = ({ icon: Icon, title, hint }) => (
  <div className="flex flex-col items-center gap-2 py-14 text-center">
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
      <Icon size={20} className="text-secondary" />
    </span>
    <p className="text-sm font-semibold text-tertiary">{title}</p>
    <p className="max-w-xs text-xs text-secondary">{hint}</p>
  </div>
);

// a record the api has not seen yet
const UnsavedChip = () => (
  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Unsaved</span>
);

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

  const tabs = [
    { key: TAB_FRANCHISES, label: "Franchises", count: franchises.length },
    { key: TAB_AREAS, label: "Areas", count: areas.length },
  ];

  const hasAnything = franchises.length > 0 || areas.length > 0;

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
        style={{ width: 640, maxWidth: "100%", maxHeight: "85vh" }}
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b color-border px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50">
              <Layers size={17} className="text-primary" />
            </span>

            <div className="min-w-0">
              <h3 className="text-base font-bold text-tertiary">Manage Map Data</h3>
              <p className="text-xs text-secondary">
                {plural(franchises.length, "franchise")} · {plural(areas.length, "area")} on this map
              </p>
            </div>
          </div>

          <button
            aria-label="Close"
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded-full p-1.5 text-secondary transition hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </header>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b color-border px-5 pt-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex cursor-pointer items-center gap-2 rounded-t-lg px-4 py-2 text-xs font-semibold transition ${
                activeTab === tab.key
                  ? "border-b-2 border-(--color-primary) text-primary"
                  : "text-secondary hover:text-tertiary"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === tab.key ? "bg-orange-50 text-primary" : "bg-gray-100 text-secondary"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
          {/* Franchises */}
          {activeTab === TAB_FRANCHISES &&
            (franchises.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No franchises yet"
                hint="Use Add Location, then click the map to drop a branch."
              />
            ) : (
              franchises.map((franchise) => (
                <article
                  key={franchise.id}
                  className="rounded-xl border color-border bg-white p-3.5 shadow-2xs transition hover:border-orange-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Building2 size={16} className="text-slate-700" />
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-tertiary">{franchise.name}</p>
                        <p className="truncate text-[11px] text-secondary">
                          {[franchise.city, franchise.state, franchise.country].filter(Boolean).join(", ") ||
                            "No location details"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {!franchise._id && <UnsavedChip />}

                      {canEdit && (canEditSavedFranchises || !franchise._id) && (
                        <RowActions
                          onEdit={() => onEditFranchise(franchise)}
                          onDelete={() => onDeleteFranchise(franchise.id)}
                          editTitle="Edit franchise details"
                          deleteTitle="Delete this franchise"
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-3 border-t color-border pt-2.5">
                    <Stat icon={MapPin} label="Coordinates" value={coordinates(franchise.lat, franchise.lng)} />
                  </div>
                </article>
              ))
            ))}

          {/* Areas */}
          {activeTab === TAB_AREAS &&
            (areas.length === 0 ? (
              <EmptyState
                icon={CircleDot}
                title="No areas yet"
                hint="Use Add Area, search the place it centres on, then set its radius."
              />
            ) : (
              areas.map((area, index) => {
                const color = AREA_COLORS[index % AREA_COLORS.length];

                return (
                  <article
                    key={area.id}
                    className="overflow-hidden rounded-xl border color-border bg-white shadow-2xs transition hover:border-orange-200"
                  >
                    <div className="flex items-start justify-between gap-3 p-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: color.badgeBg }}
                        >
                          <CircleDot size={16} style={{ color: color.stroke }} />
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-tertiary">{area.name}</p>
                          <p className="truncate text-[11px] text-secondary">
                            Circle around {coordinates(area.lat, area.lng)}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {!area._id && <UnsavedChip />}

                        {canEdit && canEditAreas && (
                          <RowActions
                            onEdit={() => onEditArea(area)}
                            onDelete={() => onDeleteArea(area.id)}
                            editTitle="Edit area details"
                            deleteTitle="Delete this area"
                          />
                        )}
                      </div>
                    </div>

                    {/* what the radius works out to */}
                    <div className="grid grid-cols-3 gap-3 border-t color-border bg-gray-50/60 px-3.5 py-2.5">
                      <Stat icon={Ruler} label="Radius" value={formatMiles(area.radiusKm)} />
                      <Stat icon={Layers} label="Covers" value={formatAreaSize(circleAreaKm2(area.radiusKm))} />
                      <Stat icon={Building2} label="Min gap" value={formatMiles(area.distanceKm)} />
                    </div>
                  </article>
                );
              })
            ))}
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between gap-3 border-t color-border px-5 py-3.5">
          {canEdit && canEditAreas && hasAnything ? (
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
        </footer>
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
