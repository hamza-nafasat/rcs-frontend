import { FileText, LifeBuoy, MessageSquare, Settings } from "lucide-react";

export const TYPE_STYLES = {
  document: "bg-blue-50 text-blue-600",
  message: "bg-purple-50 text-purple-600",
  support: "bg-amber-50 text-amber-600",
  system: "bg-gray-100 text-gray-600",
};

export const getTypeIcon = (type, size = 18) => {
  switch (type) {
    case "document":
      return <FileText size={size} />;
    case "support":
      return <LifeBuoy size={size} />;
    case "message":
      return <MessageSquare size={size} />;
    default:
      return <Settings size={size} />;
  }
};
