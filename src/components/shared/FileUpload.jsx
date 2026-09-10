import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

const FileUpload = ({
  label,
  accept = ".pdf,.png,.jpg,.jpeg,.zip",
  hint = "Supports PDF, PNG, JPG, ZIP up to 10MB",
  file,
  onFileChange,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const maxSize = 10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      return;
    }

    onFileChange(selectedFile);
  };

  const handleChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    handleFile(droppedFile);
  };

  const handleClear = () => {
    onFileChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <section className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-tertiary">
          {label}
        </label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-xl border border-dashed px-4 py-5 transition ${
          isDragging
            ? "border-primary bg-orange-50"
            : "border-[#E5E7EB] bg-white"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm text-tertiary">
              {file.name}
            </p>

            <button
              aria-label="Remove file"
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <Upload
              size={26}
              className="mb-2 text-primary"
            />

            <p className="text-sm font-medium text-tertiary">
              Drag & drop your files here, or{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-medium text-primary underline"
              >
                browse
              </button>
            </p>

            <p className="text-xs text-secondary">
              {hint}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FileUpload;