const BORDER = "1px solid var(--color-border)";

const PADDING = "20px";

const BASE = {
  table: { style: { width: "100%" } },
  rows: { stripedStyle: { backgroundColor: "var(--color-bg-muted)" } },
  // long values wrap instead of spilling
  cells: {
    style: {
      minWidth: 0,
      paddingTop: "10px",
      paddingBottom: "10px",
      whiteSpace: "normal",
      overflowWrap: "anywhere",
      wordBreak: "break-word",
    },
  },
};

// the look a table wears
const VARIANTS = {
  bare: {},
  boxed: {
    responsiveWrapper: { style: { width: "100%", border: BORDER, borderRadius: "8px" } },
    headRow: { style: { backgroundColor: "var(--color-bg-muted)" } },
    headCells: { style: { color: "var(--color-text-secondary)", fontSize: "12px", fontWeight: "600" } },
  },
  plain: {
    table: { style: { backgroundColor: "transparent" } },
    headRow: {
      style: {
        backgroundColor: "transparent",
        borderBottomWidth: "1px",
        borderBottomColor: "var(--color-border)",
        minHeight: "44px",
      },
    },
    headCells: {
      style: {
        paddingLeft: PADDING,
        paddingRight: PADDING,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "var(--color-text-muted)",
      },
    },
    cells: { style: { paddingLeft: PADDING, paddingRight: PADDING, fontSize: "14px" } },
    rows: { style: { minHeight: "64px", borderBottomColor: "var(--color-border)" } },
  },
};

// scrolls inside its card, pagination pinned
const FILL_HEIGHT = {
  tableWrapper: { style: { width: "100%", height: "100%" } },
  responsiveWrapper: { style: { width: "100%", flex: "1 1 auto", minHeight: 0, overflowY: "auto" } },
  pagination: { style: { marginTop: "auto", flex: "0 0 auto", borderTop: BORDER } },
};

// later parts win, style by style
const tableStyles = (variant = "bare", fillHeight = false) =>
  [BASE, VARIANTS[variant] ?? VARIANTS.bare, fillHeight ? FILL_HEIGHT : {}].reduce((merged, part) => {
    Object.entries(part).forEach(([slot, rules]) => {
      merged[slot] = { ...merged[slot] };
      Object.entries(rules).forEach(([key, value]) => {
        merged[slot][key] = { ...(merged[slot][key] ?? {}), ...value };
      });
    });
    return merged;
  }, {});

export { tableStyles };
