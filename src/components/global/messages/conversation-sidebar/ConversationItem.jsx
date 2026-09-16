import Avatar from "../../../shared/Avatar";
import { formatChatTime } from "../../../../utils/formatTime";

// what the list shows when the last message was not words
const ATTACHMENT_PREVIEW = {
  image: "Photo",
  voice: "Voice note",
  file: "File",
};

const ConversationItem = ({ conversation, isSelected, onSelect }) => {
  const { _id, contact, lastMessage, lastMessageAt, unreadCount } = conversation;
  const preview = lastMessage?.text || ATTACHMENT_PREVIEW[lastMessage?.attachmentType] || "";

  return (
    <button
      type="button"
      onClick={() => onSelect(_id)}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
        isSelected ? "bg-orange-50" : "hover:bg-gray-50"
      }`}
    >
      <Avatar src={contact?.image?.url} name={contact?.fullName} size={40} rounded="rounded-full" />

      {/* Conversation Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">{contact?.fullName}</p>
          <span className="shrink-0 text-xs text-gray-400">{formatChatTime(lastMessageAt)}</span>
        </div>

        <p className="truncate text-xs text-gray-500">{contact?.email}</p>
        <p className="mt-0.5 truncate text-xs text-gray-400">{preview}</p>
      </div>

      {/* Unread Count */}
      {unreadCount > 0 && (
        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-medium text-white">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default ConversationItem;
