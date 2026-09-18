import { FileText, GitBranch, UserCog, Users } from "lucide-react";

// metric matches the api totals
export const statCards = [
  {
    metric: "franchisees",
    icon: Users,
    iconTile: { color: "#2563eb", bg: "#eff6ff" },
    label: "Total Franchisee",
  },
  {
    metric: "pipelines",
    icon: GitBranch,
    iconTile: { color: "#f97316", bg: "#fff7ed" },
    label: "Total Pipelines",
  },
  {
    metric: "fdds",
    icon: FileText,
    iconTile: { color: "#22c55e", bg: "#f0fdf4" },
    label: "Total FDDs",
  },
  {
    metric: "moderators",
    icon: UserCog,
    iconTile: { color: "#9333ea", bg: "#faf5ff" },
    label: "Total Moderators",
  },
];
