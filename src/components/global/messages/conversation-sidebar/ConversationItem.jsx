import { MoreVertical, Trash2 } from "lucide-react";
import Avatar from "../../../shared/Avatar";
import Button from "../../../shared/Button";
import Dropdown from "../../../shared/Dropdown";

// preview when there are no words
const ATTACHMENT_PREVIEW = {
  image: "Photo",
  voice: "Voice note",
  file: "File",
};

const ConversationItem = ({ conversation, isSelected, onSelect, onDelete }) => {
  const { _id, contact, lastMessage, unreadCount } = conversation;
  const preview = lastMessage?.text || ATTACHMENT_PREVIEW[lastMessage?.attachmentType] || "";

  return (
    <div className={`flex items-center pr-2 transition-colors ${isSelected ? "bg-orange-50" : "hover:bg-gray-50"}`}>
      <button
        type="button"
        onClick={() => onSelect(_id)}
        className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-4 pr-2 text-left"
      >
        <Avatar src={contact?.image?.url} name={contact?.fullName} size={40} rounded="rounded-full" />

        {/* Conversation Content */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{contact?.fullName}</p>
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

      <Dropdown
        align="right"
        trigger={
          <Button
            variant="bare"
            aria-label="Conversation options"
            className="shrink-0 rounded-lg p-1! text-gray-400 hover:text-gray-600"
          >
            <MoreVertical size={16} />
          </Button>
        }
      >
        <Button variant="menuItemDanger" onClick={() => onDelete?.(conversation)}>
          <Trash2 size={16} className="shrink-0" />
          Delete conversation
        </Button>
      </Dropdown>
    </div>
  );
};

export default ConversationItem;
