import { USER_STATUSES } from "../../../../configs/constants";

export const CLIENT_STATUS = {
  invited: { label: "Invited", pill: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
  active: { label: "Active", pill: "bg-revenue text-[#22C55E]", dot: "bg-[#22C55E]" },
  at_risk: { label: "At Risk", pill: "bg-[#FEF2F2] text-[#EF4444]", dot: "bg-[#EF4444]" },
  on_hold: { label: "On Hold", pill: "bg-[#FFFBEB] text-[#F59E0B]", dot: "bg-[#F59E0B]" },
  pending: { label: "Pending", pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
};

// invited, else the chosen status
export const getClientStatus = (client) =>
  client?.account?.status === USER_STATUSES.INVITED ? "invited" : (client?.status ?? "pending");
