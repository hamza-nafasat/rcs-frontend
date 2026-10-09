import { useState } from "react";
import { X } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Select from "../../../../components/shared/Select";
import FileUpload from "../../../../components/shared/FileUpload";
import Button from "../../../../components/shared/Button";
import { useGetAllFddsQuery } from "../../../../store/apis/shared/fdd.apis";
import { FDD_STATE_OPTIONS, GENERAL_FDD_STATE, requiredFddStates } from "../../../../utils/fddStateHelper";

const INITIAL_FORM = {
  title: "",
  version: "",
  restaurant: "",
  country: "United States",
  state: GENERAL_FDD_STATE,
  isFillRequired: true,
};

// the restaurant arrives populated
const toForm = (document) =>
  document
    ? {
        ...INITIAL_FORM,
        title: document.title ?? "",
        version: document.version ?? "",
        restaurant: document.restaurant?._id ?? document.restaurant ?? "",
        country: document.country ?? INITIAL_FORM.country,
        state: document.state ?? INITIAL_FORM.state,
        isFillRequired: document.isFillRequired ?? INITIAL_FORM.isFillRequired,
      }
    : INITIAL_FORM;

const FddAddEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "add",
  isSubmitting = false,
  clients = [],
}) => {
  const isAdd = mode === "add";
  const [formData, setFormData] = useState(() => toForm(initialData));
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // what this brand already has on file
  const { data: brandFdds } = useGetAllFddsQuery(
    { restaurant: formData.restaurant },
    { skip: !formData.restaurant },
  );
  const uploadedStates = new Set((brandFdds?.data ?? []).map((document) => document?.state));

  // the documents this brand's locations need
  const selectedClient = clients.find((client) => client.value === formData.restaurant);
  const requiredStates = new Set(requiredFddStates(selectedClient?.restaurantStates));
  const stateOptions = FDD_STATE_OPTIONS.map((state) =>
    requiredStates.has(state)
      ? { value: state, label: state, isRequired: true, isFulfilled: uploadedStates.has(state) }
      : state,
  );

  // the ones this brand has still to upload
  const missingStates = [...requiredStates].filter((state) => !uploadedStates.has(state));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, file });
  };

  // a new document needs its pdf
  const isComplete =
    formData.title.trim() !== "" && formData.version.trim() !== "" && formData.restaurant !== "" && (!isAdd || file);

  if (!isOpen) return null;

  return (
    <article className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-4 sm:items-center sm:py-6">
      <article className="max-h-[calc(100dvh-2rem)] w-full max-w-150 overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:max-h-[calc(100dvh-3rem)] sm:p-6">
        {/* Header */}
        <section className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isAdd ? "Upload FDD Document" : "Edit FDD Document"}
            </h2>

            <p className="mt-1 text-sm text-secondary">
              {isAdd
                ? "Add a new version of the franchise disclosure document for this brand and state."
                : "Update the details of this franchise disclosure document, or replace the PDF."}
            </p>
          </div>

          <button
            aria-label="Close dialog"
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & version */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-12">
            <div className="sm:col-span-7">
              <Input
                label="Document Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. California State FDD 2025"
                required
              />
            </div>

            <div className="sm:col-span-5">
              <Input
                label="Version Identifier *"
                name="version"
                value={formData.version}
                onChange={handleChange}
                placeholder="e.g. v3.2"
                required
              />
            </div>
          </section>

          {/* Which brand, and where it applies */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Restaurant Brand *"
              name="restaurant"
              value={formData.restaurant}
              onChange={handleChange}
              placeholder={clients.length === 0 ? "No clients yet" : "Select a restaurant"}
              options={clients}
              searchable
              required
            />

            <div className="flex flex-col gap-1">
              <Select
                label="FDD State *"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Select state"
                options={stateOptions}
                searchable
                required
              />

              {/* only while something is outstanding */}
              {missingStates.length > 0 && (
                <p className="text-xs text-muted">
                  <span className="text-remove">*</span> still missing for this brand&apos;s locations
                </p>
              )}
            </div>
          </section>

          {/* PDF File Upload */}
          <section>
            <FileUpload
              label={isAdd ? "PDF Document *" : "Replace PDF Document"}
              accept=".pdf"
              hint="An FDD is always a PDF, up to 25MB"
              file={file}
              onFileChange={setFile}
            />
          </section>

          {/* Does the client have to sign it */}
          <section>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
                formData.isFillRequired ? "border-primary bg-moderator" : "color-border bg-white hover:bg-muted"
              }`}
            >
              <input
                type="checkbox"
                name="isFillRequired"
                checked={formData.isFillRequired}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 shrink-0 accent-(--color-primary)"
              />

              <span className="min-w-0">
                <span className="block text-sm font-medium text-tertiary">Fill required from client</span>
                <span className="block text-xs text-muted">
                  The client sees the Fill FDD action only when this is on
                </span>
              </span>
            </label>
          </section>

          {/* Actions */}
          <section className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-1/2 text-gray-700! bg-gray-100! px-3! py-2! sm:px-4! sm:py-2.5!"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!isComplete}
              className="w-full sm:w-1/2 px-3! py-2! sm:px-4! sm:py-2.5!"
            >
              {isAdd ? "Upload FDD" : "Save Changes"}
            </Button>
          </section>
        </form>
      </article>
    </article>
  );
};

export default FddAddEditModal;
