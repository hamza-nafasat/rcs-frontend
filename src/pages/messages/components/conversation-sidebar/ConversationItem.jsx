import Avatar from "../../../../components/shared/Avatar";

const ConversationItem = ({ conversation, isSelected, onSelect }) => {
  const {
    id,
    name,
    company,
    lastMessage,
    lastMessageTime,
    unreadCount,
    avatar,
    status,
  } = conversation;

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
        isSelected ? "bg-orange-50" : "hover:bg-gray-50"
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar src={avatar} name={name} size={40} rounded="rounded-full" />
        {status === "online" && (
          <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
        )}
      </div>

      {/* Conversation Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
          <span className="shrink-0 text-xs text-gray-400">
            {lastMessageTime}
          </span>
        </div>
        <p className="truncate text-xs text-gray-500">{company}</p>
        <p className="mt-0.5 truncate text-xs text-gray-400">{lastMessage}</p>
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
