import { Store, X } from "lucide-react";
import Input from "../../shared/Input";
import LocationFields from "../LocationFields";

// needs a name and place
const isComplete = (form) => Boolean(form?.name?.trim() && form?.state && form?.city);

const MapFranchiseFormModal = ({ form, location, isEditing = false, onChange, onSubmit, onClose }) => (
  <div
    className="fixed inset-0 flex items-center justify-center p-4"
    style={{ zIndex: 10000, background: "rgba(0,0,0,0.5)" }}
  >
    <div
      className="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      style={{ width: 440, maxWidth: "100%", maxHeight: "88vh" }}
    >
      <div className="flex items-center justify-between border-b color-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50">
            <Store size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-base font-bold text-tertiary">
              {isEditing ? "Edit Franchise" : "Add Franchise Details"}
            </h3>
            <p className="text-xs text-secondary">Enter the details for this franchise location</p>
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

      <form
        onSubmit={(event) => {
          // keep outer forms from submitting
          event.stopPropagation();
          onSubmit?.(event);
        }}
        className="flex flex-col gap-4 overflow-y-auto p-5"
      >
        <Input
          label="Franchise Name *"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="e.g. Downtown Grill"
          required
        />

        <LocationFields values={form} onChange={onChange} required showCountry={false} />

        <div className="rounded-xl border color-border bg-gray-50/70 p-3.5 text-center">
          <p className="text-[10px] font-semibold uppercase text-secondary">Dropped At</p>
          <p className="mt-0.5 text-xs font-semibold text-tertiary">
            {location.lat.toFixed(5)}°, {location.lng.toFixed(5)}°
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="h-10 flex-1 cursor-pointer rounded-xl border color-border bg-white text-xs font-semibold text-cancel transition hover:bg-gray-50"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={!isComplete(form)}
            className={`h-10 flex-1 rounded-xl bg-(--color-primary) text-xs font-bold text-white transition ${
              isComplete(form) ? "cursor-pointer hover:opacity-90" : "pointer-events-none opacity-60"
            }`}
          >
            {isEditing ? "Update Franchise" : "Save Franchise"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default MapFranchiseFormModal;
