import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

const MAX_SIZE = 10 * 1024 * 1024;

const FileUpload = ({
  label,
  accept = ".pdf,.png,.jpg,.jpeg,.zip",
  hint = "Supports PDF, PNG, JPG, ZIP up to 10MB",
  file,
  onFileChange,
  multiple = false,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // many files or one, never mixed
  const selected = multiple ? (Array.isArray(file) ? file : []) : file;
  const hasFiles = multiple ? selected.length > 0 : Boolean(selected);

  const handleFiles = (list) => {
    const accepted = [...(list ?? [])].filter((item) => item && item.size <= MAX_SIZE);
    if (accepted.length === 0) return;

    onFileChange(multiple ? [...selected, ...accepted] : accepted[0]);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClear = (target) => {
    onFileChange(multiple ? selected.filter((item) => item !== target) : null);

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <section className="w-full">
      {label && <label className="mb-1 block text-sm font-medium text-tertiary">{label}</label>}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-xl border border-dashed px-4 py-5 transition ${
          isDragging ? "border-primary bg-orange-50" : "color-border bg-white"
        }`}
      >
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={handleChange} className="hidden" />

        {hasFiles ? (
          <div className="flex flex-col gap-2">
            {(multiple ? selected : [selected]).map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-3">
                <p className="truncate text-sm text-tertiary">{item.name}</p>

                <button
                  aria-label={`Remove ${item.name}`}
                  type="button"
                  onClick={() => handleClear(item)}
                  className="rounded-full p-1 text-muted hover:bg-active"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {/* more files can still join */}
            {multiple && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="self-start text-xs font-medium text-primary underline"
              >
                Add another file
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <Upload size={26} className="mb-2 text-primary" />

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

            <p className="text-xs text-secondary">{hint}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FileUpload;
