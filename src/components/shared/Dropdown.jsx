import { useState, useRef, useEffect } from "react";

const Dropdown = ({ trigger, children, align = "right", className = "" }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        {trigger}
      </button>

      {open && (
        <div
          className={`absolute top-full z-50 mt-2 min-w-48 rounded-xl border border-gray-100 bg-white p-1 shadow-lg ${
            align === "left" ? "left-0" : "right-0"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
