import { Pencil, Plus, Trash2 } from "lucide-react";

// logs older than this are gone
const ACTIVITY_RETENTION_DAYS = 5;

// how each action reads and looks
const ACTIVITY_ACTIONS = {
  create: { label: "Created", icon: Plus, color: "#16a34a", bg: "#f0fdf4" },
  update: { label: "Updated", icon: Pencil, color: "#2563eb", bg: "#eff6ff" },
  delete: { label: "Deleted", icon: Trash2, color: "#dc2626", bg: "#fef2f2" },
};

const ACTIVITY_MODULES = {
  clients: "Clients",
  fdds: "FDDs",
  pipelines: "Pipelines",
  supports: "Supports",
  accounts: "Accounts",
  messages: "Messages",
};

const ACTIVITY_ACTION_OPTIONS = Object.entries(ACTIVITY_ACTIONS).map(([value, { label }]) => ({ value, label }));

const ACTIVITY_MODULE_OPTIONS = Object.entries(ACTIVITY_MODULES).map(([value, label]) => ({ value, label }));

// an unknown action still renders
const actionOf = (action) => ACTIVITY_ACTIONS[action] ?? ACTIVITY_ACTIONS.update;

// today, yesterday, or the date
const dayLabel = (value) => {
  const date = new Date(value);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === new Date().toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" });
};

const exactTime = (value) =>
  value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "";

export {
  ACTIVITY_ACTION_OPTIONS,
  ACTIVITY_MODULE_OPTIONS,
  ACTIVITY_MODULES,
  ACTIVITY_RETENTION_DAYS,
  actionOf,
  dayLabel,
  exactTime,
};
