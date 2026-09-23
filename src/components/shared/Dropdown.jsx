import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  cloneElement,
} from "react";
import { createPortal } from "react-dom";

const MENU_MARGIN = 8;

const Dropdown = ({
  trigger,
  children,
  align = "right",
  className = "",
  portalClassName = "",
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth ?? 192;
    const menuHeight = menuRef.current?.offsetHeight ?? 0;
    let top = rect.bottom + MENU_MARGIN;
    if (top + menuHeight > window.innerHeight - MENU_MARGIN) {
      top = Math.max(MENU_MARGIN, rect.top - MENU_MARGIN - menuHeight);
    }

    let left = align === "left" ? rect.left : rect.right - menuWidth;
    left = Math.min(
      Math.max(MENU_MARGIN, left),
      window.innerWidth - menuWidth - MENU_MARGIN,
    );

    setPosition({ top, left });
  }, [align]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (
        !triggerRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  // the trigger opens it, never a wrapper
  const toggle = (event) => {
    trigger?.props?.onClick?.(event);
    setPosition(null);
    setOpen((prev) => !prev);
  };

  return (
    <div ref={triggerRef} className={`relative ${className}`}>
      {cloneElement(trigger, { onClick: toggle, "aria-haspopup": "menu", "aria-expanded": open })}

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              visibility: position ? "visible" : "hidden",
            }}
            onClick={() => setOpen(false)}
            className={`fixed z-50 min-w-48 rounded-xl border border-gray-100 bg-white p-1 shadow-lg ${portalClassName}`}
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Dropdown;
