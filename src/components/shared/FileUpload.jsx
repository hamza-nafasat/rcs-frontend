import { Upload, X } from "lucide-react";
import { useRef } from "react";

const FileUpload = ({
  label,
  accept = "application/pdf",
  hint = "PDF up to 10MB",
  file,
  onFileChange,
}) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    onFileChange(e.target.files?.[0] || null);
  };

  const handleClear = () => {
    onFileChange(null);

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <section className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-[#111111]">
          {label}
        </label>
      )}

      <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white px-4 py-6">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm text-[#111111]">{file.name}</p>

            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload size={20} className="text-secondary" />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-sm font-medium text-primary underline"
            >
              Choose a file
            </button>

            <p className="text-xs text-secondary">{hint}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FileUpload;
