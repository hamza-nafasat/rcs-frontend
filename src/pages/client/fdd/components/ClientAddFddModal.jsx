import { useState } from "react";
import { X } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Select from "../../../../components/shared/Select";
import FileUpload from "../../../../components/shared/FileUpload";
import Button from "../../../../components/shared/Button";

const INITIAL_FORM = {
  title: "",
  version: "",
  brands: [],
  country: "",
  state: "",
};

const ClientAddFddModal = ({
  isOpen,
  onClose,
  onSubmit,
  brands = [],
  countries = [],
  states = [],
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.brands.length === 0) return;

    onSubmit({ ...formData, file });
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
              Add a new version of the franchise disclosure document.
            </p>
          </div>

          <button
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
                placeholder="Enter document title"
                required
              />
            </div>

            <div className="sm:col-span-5">
              <Input
                label="Version Identifier *"
                name="version"
                value={formData.version}
                onChange={handleChange}
                placeholder="e.g. v1.0"
                required
              />
            </div>
          </section>

          {/* Brand */}
          <section>
            <Select
              label="Restaurant Brands *"
              name="brands"
              value={formData.brands}
              onChange={handleChange}
              placeholder="Select restaurant brands"
              options={brands}
              multiple
              searchable
              clearable
              required
            />
          </section>

          {/* Target location */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Target Country *"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Select target country"
              options={countries}
              required
            />

            <Select
              label="Target State / Region *"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Select target state/region"
              options={states}
              required
            />
          </section>

          {/* Document file */}
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
              Upload
            </Button>
          </section>
        </form>
      </article>
    </article>
  );
};

export default ClientAddFddModal;
