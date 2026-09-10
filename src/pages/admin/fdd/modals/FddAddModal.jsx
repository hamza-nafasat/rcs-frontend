import { useState } from "react";
import { X } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Select from "../../../../components/shared/Select";
import FileUpload from "../../../../components/shared/FileUpload";
import Button from "../../../../components/shared/Button";
import { US_STATES } from "../../../../utils/fddStateHelper";

const DEFAULT_BRANDS = ["Burger Hub", "Pizza Corner", "Sushi Place", "Taco Town"];
const DEFAULT_COUNTRIES = ["United States"];
const DEFAULT_STATES = [
  "General (Non-Registration States)",
  ...US_STATES.map((s) => s.name),
];

const FDD_TYPE_OPTIONS = [
  "State-Specific Registration FDD",
  "General Federal FDD",
];

const INITIAL_FORM = {
  title: "",
  version: "",
  brands: [],
  country: "United States",
  state: "California",
  fddType: "State-Specific Registration FDD",
  status: "Approved",
};

const FddAddModal = ({
  isOpen,
  onClose,
  onSubmit,
  brands = DEFAULT_BRANDS,
  countries = DEFAULT_COUNTRIES,
  states = DEFAULT_STATES,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [file, setFile] = useState(null);

  const availableBrands = brands.length > 0 ? brands : DEFAULT_BRANDS;
  const availableCountries = countries.length > 0 ? countries : DEFAULT_COUNTRIES;
  const availableStates = states.length > 0 ? states : DEFAULT_STATES;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto adjust FDD type if state changes
      if (name === "state") {
        if (value.includes("General")) {
          updated.fddType = "General Federal FDD";
        } else {
          updated.fddType = "State-Specific Registration FDD";
        }
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.brands.length === 0) return;

    const documentName = file
      ? file.name
      : formData.title
        ? `${formData.title}.pdf`
        : `${formData.state} FDD ${formData.version}.pdf`;

    onSubmit({
      ...formData,
      document: documentName,
      file,
    });
  };

  if (!isOpen) return null;

  return (
    <article className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-4 sm:items-center sm:py-6">
      <article className="max-h-[calc(100dvh-2rem)] w-full max-w-150 overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:max-h-[calc(100dvh-3rem)] sm:p-6">
        {/* Header */}
        <section className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Upload FDD Document
            </h2>

            <p className="mt-1 text-sm text-secondary">
              Add a new version of the franchise disclosure document for a specific state or general coverage.
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

          {/* Restaurant Brand Select */}
          <section>
            <Select
              label="Restaurant Brands *"
              name="brands"
              value={formData.brands}
              onChange={handleChange}
              placeholder="Select restaurant brands"
              options={availableBrands}
              multiple
              searchable
              clearable
              required
            />
          </section>

          {/* Target location Selects */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="State *"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Select state"
              options={availableStates}
              searchable
              clearable
              required
            />
            <Select
              label="FDD Document Type *"
              name="fddType"
              value={formData.fddType}
              onChange={handleChange}
              options={FDD_TYPE_OPTIONS}
              placeholder="Select FDD Document Type"
            />
          </section>

          {/* PDF File Upload */}
          <section>
            <FileUpload
              label="PDF Document *"
              file={file}
              onFileChange={setFile}
            />
          </section>

          {/* Actions */}
          <section className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-1/2 text-gray-700! bg-gray-100! px-3! py-2! sm:px-4! sm:py-2.5!"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="w-1/2 px-3! py-2! sm:px-4! sm:py-2.5!"
            >
              Upload FDD
            </Button>
          </section>
        </form>
      </article>
    </article>
  );
};

export default FddAddModal;
