import { X } from "lucide-react";
import Avatar from "../../../shared/Avatar";

const ChatHeader = ({ conversation, onBack }) => {
  const contact = conversation?.contact;

  return (
    <header className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 sm:px-5">
      <Avatar src={contact?.image?.url} name={contact?.fullName} size={40} rounded="rounded-full" />

      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-gray-900">{contact?.fullName}</h2>
        <p className="truncate text-xs text-gray-500">{contact?.email}</p>
      </div>

      <div className="ml-auto">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 text-gray-500 transition-colors hover:text-gray-800 md:hidden"
          aria-label="Back to conversations"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
