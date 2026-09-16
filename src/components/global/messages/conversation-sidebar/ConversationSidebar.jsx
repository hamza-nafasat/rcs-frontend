import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import ConversationItem from "./ConversationItem";
import Button from "../../../shared/Button";
import Input from "../../../shared/Input";
import MessageNewConversationModal from "../../../modals/MessageNewConversationModal";

const ConversationSidebar = ({
  conversations,
  contacts = [],
  selectedConversationId,
  onSelectConversation,
  onStartConversation,
}) => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSelectContact = (contact) => {
    onStartConversation?.(contact);
    setIsModalOpen(false);
  };

  return (
    <aside className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="shrink-0 px-4">
        <h2 className="text-base mb-2 mt-2 font-semibold text-gray-900">
          Messages
        </h2>

        <Button
          onClick={() => setIsModalOpen(true)}
          iconPosition="left"
          icon={<Plus size={16} />}
          className="mb-2 w-full px-3! py-2! text-sm"
        >
          New Conversation
        </Button>

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
        {filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={conversation.id === selectedConversationId}
            onSelect={onSelectConversation}
          />
        ))}
      </div>

      {isModalOpen && (
        <MessageNewConversationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          contacts={contacts}
          onSelect={handleSelectContact}
        />
      )}
    </aside>
  );
};

export default ConversationSidebar;
