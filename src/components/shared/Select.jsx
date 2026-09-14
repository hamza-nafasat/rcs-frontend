import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";

const MAX_RENDERED_OPTIONS = 100;

const normalizeOption = (option) =>
  typeof option === "string" || typeof option === "number"
    ? { value: option, label: String(option) }
    : { value: option.value, label: option.label ?? String(option.value) };

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  multiple = false,
  searchable = false,
  clearable = false,
  creatable = false,
  isLoading = false,
  disabled = false,
  required = false,
  className = "",
  labelClassName = "",
  menuClassName = "",
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  const normalizedOptions = useMemo(
    () => options.map(normalizeOption),
    [options],
  );

  const selectedValues = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value === "" || value === undefined || value === null
      ? []
      : [value];

  const selectedLabels = selectedValues.map(
    (selected) =>
      normalizedOptions.find((option) => option.value === selected)?.label ??
      String(selected),
  );

  const visibleOptions = searchable
    ? normalizedOptions.filter((option) =>
        option.label.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : normalizedOptions;

  // long lists show the first matches, typing narrows them
  const renderedOptions = visibleOptions.slice(0, MAX_RENDERED_OPTIONS);

  // a typed value that is not in the list yet
  const trimmedQuery = query.trim();
  const canCreate =
    creatable &&
    trimmedQuery !== "" &&
    !normalizedOptions.some((option) => option.label.toLowerCase() === trimmedQuery.toLowerCase());

  const closeMenu = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) closeMenu();
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Emits an event-like object so callers can keep using `e.target.name/value`
  const emit = (nextValue) =>
    onChange?.({ target: { name, value: nextValue } });

  const handleSelect = (optionValue) => {
    if (multiple) {
      emit(
        selectedValues.includes(optionValue)
          ? selectedValues.filter((item) => item !== optionValue)
          : [...selectedValues, optionValue],
      );

      return;
    }

    emit(optionValue);
    closeMenu();
  };

  // enter picks the typed value or the only match, and never submits the form
  const handleSearchKeyDown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (canCreate) handleSelect(trimmedQuery);
    else if (visibleOptions.length === 1) handleSelect(visibleOptions[0].value);
  };

  const handleClear = (event) => {
    event.stopPropagation();
    emit(multiple ? [] : "");
  };

  const hasSelection = selectedValues.length > 0;

  const triggerText = !hasSelection
    ? placeholder
    : multiple && selectedValues.length > 0
      ? `${selectedValues.length} selected`
      : selectedLabels.join(", ");

  return (
    <section className="w-full min-w-40" ref={containerRef}>
      {label && (
        <label
          htmlFor={id ?? name}
          className={`mb-1 block text-sm font-medium text-tertiary ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          id={id ?? name}
          type="button"
          disabled={disabled}
          onClick={() => (open ? closeMenu() : setOpen(true))}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-required={required}
          className={`flex h-10 w-full cursor-pointer items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 text-left text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-50 ${className}`}
        >
          <span
            className={`min-w-0 flex-1 truncate ${
              hasSelection ? "text-tertiary" : "text-muted"
            }`}
          >
            {triggerText}
          </span>

          {clearable && hasSelection && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear selection"
              onClick={handleClear}
              className="shrink-0 rounded-full p-0.5 text-secondary hover:bg-gray-100"
            >
              <X size={14} />
            </span>
          )}

          <ChevronDown
            size={16}
            className={`shrink-0 text-secondary transition ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div
            role="listbox"
            aria-multiselectable={multiple}
            className={`absolute left-0 right-0 z-30 mt-1 rounded-xl border border-gray-100 bg-white p-1 shadow-lg ${menuClassName}`}
          >
            {searchable && (
              <div className="relative p-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={creatable ? "Search or type..." : "Search..."}
                  className="h-9 w-full rounded-lg border border-[#E5E7EB] pl-8 pr-3 text-sm outline-none focus:border-primary"
                />
              </div>
            )}

            <div className="max-h-60 overflow-y-auto">
              {canCreate && (
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => handleSelect(trimmedQuery)}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-tertiary transition hover:bg-gray-50"
                >
                  <Plus size={14} className="shrink-0 text-(--color-primary)" />
                  <span className="min-w-0 flex-1 truncate">Use "{trimmedQuery}"</span>
                </button>
              )}

              {isLoading ? (
                <p className="px-3 py-4 text-center text-sm text-muted">Loading...</p>
              ) : visibleOptions.length === 0 ? (
                !canCreate && (
                  <p className="px-3 py-4 text-center text-sm text-muted">
                    No options found
                  </p>
                )
              ) : (
                renderedOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option.value)}
                      className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-gray-50 ${
                        isSelected ? "text-tertiary" : "text-secondary"
                      }`}
                    >
                      {multiple && (
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            isSelected
                              ? "border-transparent bg-(--color-primary) text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <Check size={12} />}
                        </span>
                      )}

                      <span className="min-w-0 flex-1 truncate">
                        {option.label}
                      </span>

                      {!multiple && isSelected && (
                        <Check
                          size={14}
                          className="shrink-0 text-(--color-primary)"
                        />
                      )}
                    </button>
                  );
                })
              )}

              {visibleOptions.length > renderedOptions.length && (
                <p className="px-3 py-2 text-center text-xs text-muted">
                  Showing {renderedOptions.length} of {visibleOptions.length}, type to narrow down
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Select;
