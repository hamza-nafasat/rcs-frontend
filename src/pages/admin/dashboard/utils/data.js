import { FileText, GitBranch, MessageSquare, Users } from "lucide-react";

// four cards, filled by api
export const statCards = [
  { metric: "clients", icon: Users, iconTile: { color: "#2563eb", bg: "#eff6ff" }, label: "Total Clients" },
  { metric: "messages", icon: MessageSquare, iconTile: { color: "#06b6d4", bg: "#ecfeff" }, label: "Total Messages" },
  { metric: "pipelines", icon: GitBranch, iconTile: { color: "#f97316", bg: "#fff7ed" }, label: "Total Pipelines" },
  { metric: "fdds", icon: FileText, iconTile: { color: "#22c55e", bg: "#f0fdf4" }, label: "Total FDDs" },
];
