import { FileText, GitBranch, MessageSquare, Users } from "lucide-react";

export const clients = [
  {
    id: 1,
    initials: "SR",
    name: "Spice Route",
    personName: "Priya Patel",
    progress: 61,
    progressColor: "#EF4444",
  },
  {
    id: 2,
    initials: "RT",
    name: "The Rustic Table",
    personName: "Marcus Williams",
    progress: 70,
    progressColor: "#FBBF24",
  },
  {
    id: 1,
    initials: "SR",
    name: "Spice Route",
    personName: "Priya Patel",
    progress: 61,
    progressColor: "#EF4444",
  },
  {
    id: 2,
    initials: "RT",
    name: "The Rustic Table",
    personName: "Marcus Williams",
    progress: 70,
    progressColor: "#FBBF24",
  },
  {
    id: 1,
    initials: "SR",
    name: "Spice Route",
    personName: "Priya Patel",
    progress: 61,
    progressColor: "#EF4444",
  },
  {
    id: 2,
    initials: "RT",
    name: "The Rustic Table",
    personName: "Marcus Williams",
    progress: 70,
    progressColor: "#FBBF24",
  },
  {
    id: 1,
    initials: "SR",
    name: "Spice Route",
    personName: "Priya Patel",
    progress: 61,
    progressColor: "#EF4444",
  },
  {
    id: 2,
    initials: "RT",
    name: "The Rustic Table",
    personName: "Marcus Williams",
    progress: 70,
    progressColor: "#FBBF24",
  },
  {
    id: 1,
    initials: "SR",
    name: "Spice Route",
    personName: "Priya Patel",
    progress: 61,
    progressColor: "#EF4444",
  },
  {
    id: 2,
    initials: "RT",
    name: "The Rustic Table",
    personName: "Marcus Williams",
    progress: 70,
    progressColor: "#FBBF24",
  },
];


export const cardData = [
  {
    icon: Users,
    iconTile: { color: "#2563eb", bg: "#eff6ff" },
    badge: "+3",
    value: "1,245",
    label: "Total Clients",
    comparison: "↑ 12% vs last month",
  },
  {
    icon: MessageSquare,
    iconTile: { color: "#06b6d4", bg: "#ecfeff" },
    badge: "+5",
    value: "2,345",
    label: "Total Messages",
    comparison: "↑ 8% vs last month",
  },
  {
    icon: GitBranch,
    iconTile: { color: "#f97316", bg: "#fff7ed" },
    badge: "+2",
    value: "567",
    label: "Total Pipelines",
    comparison: "↑ 15% vs last month",
  },
  {
    icon: FileText,
    iconTile: { color: "#22c55e", bg: "#f0fdf4" },
    badge: "+72",
    value: "48",
    label: "Total FDDs",
    comparison: "↑ 15% vs last month",
  },
];

export const chartMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export const fddVsSupports = [
  {
    label: "FDDs",
    data: [8, 14, 11, 19, 16, 24],
    borderColor: "#22C55E",
    backgroundColor: "transparent",
    tension: 0.4,
  },
  {
    label: "Supports",
    data: [5, 9, 13, 10, 18, 15],
    borderColor: "#F97316",
    backgroundColor: "transparent",
    tension: 0.4,
  },
];

export const clientsVsLeads = [
  { label: "Clients", data: [20, 35, 28, 50, 45, 70], backgroundColor: "#F97316" },
  { label: "Leads", data: [15, 30, 40, 35, 55, 60], backgroundColor: "#2563EB" },
];

export const leadsOutcome = {
  labels: ["Approved", "Denied", "Pending"],
  data: [25, 20, 15],
  colors: ["#047857", "#DC2626", "#EAB308"],
};

export const recentSupports = [
  {
    _id: "tkt-1",
    ticketId: "#TKT-4A19C2",
    subject: "Cannot upload signed FDD",
    status: "in_progress",
    restaurant: { restaurantName: "Coastal Bistro" },
  },
  {
    _id: "tkt-2",
    ticketId: "#TKT-77B0E4",
    subject: "Billing invoice mismatch",
    status: "in_progress",
    restaurant: { restaurantName: "Spice Route" },
  },
  {
    _id: "tkt-3",
    ticketId: "#TKT-2D5F91",
    subject: "Franchisee cannot sign in",
    status: "resolved",
    restaurant: { restaurantName: "The Rustic Table" },
  },
  {
    _id: "tkt-4",
    ticketId: "#TKT-9C3A08",
    subject: "Territory map not loading",
    status: "in_progress",
    restaurant: { restaurantName: "Urban Greens" },
  },
  {
    _id: "tkt-5",
    ticketId: "#TKT-5E8B73",
    subject: "Request to change owner email",
    status: "closed",
    restaurant: { restaurantName: "Golden Harvest" },
  },
  {
    _id: "tkt-6",
    ticketId: "#TKT-1F6D42",
    subject: "Duplicate applicant record",
    status: "resolved",
    restaurant: { restaurantName: "Harbour Grill" },
  },
];
