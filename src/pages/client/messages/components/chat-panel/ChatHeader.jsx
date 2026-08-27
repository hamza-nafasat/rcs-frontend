import { X } from "lucide-react";
import Avatar from "../../../../../components/shared/Avatar";

const ChatHeader = ({ conversation, onBack }) => {
  const { name, company, avatar, status } = conversation;

  return (
    <header className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 sm:px-5">
      <div className="relative shrink-0">
        <Avatar src={avatar} name={name} size={40} rounded="rounded-full" />

        {status === "online" && (
          <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
        )}
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-gray-900">{name}</h2>

        <p className="truncate text-xs text-gray-500">{company}</p>
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
