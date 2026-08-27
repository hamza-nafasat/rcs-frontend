import { useMemo, useState } from "react";
import ConversationItem from "./ConversationItem";
import Input from "../../../../../components/shared/Input";

const ConversationSidebar = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}) => {
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter(
      ({ name, company, lastMessage }) =>
        name.toLowerCase().includes(query) ||
        company.toLowerCase().includes(query) ||
        lastMessage.toLowerCase().includes(query),
    );
  }, [conversations, search]);

  return (
    <aside className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="shrink-0 px-4">
        <h2 className="text-base mb-2 mt-2 font-semibold text-gray-900">
          Messages
        </h2>

        {/* Search */}
        <Input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search conversations..."
          className="h-9 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-300"
        />
      </div>

      {/* Conversations */}
      <div className="mt-5 min-h-0 flex-1 overflow-y-auto border-t border-gray-200">
        {/* ConversationItem components will come here */}
        {filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={conversation.id === selectedConversationId}
            onSelect={onSelectConversation}
          />
        ))}
      </div>
    </aside>
  );
};

export default ConversationSidebar;
