import { useState } from "react";
import ConversationSidebar from "./conversation-sidebar/ConversationSidebar";
import ChatPanel from "./chat-panel/ChatPanel";

const MessagesView = ({
  conversations: initialConversations = [],
  initialMessages = {},
  contacts = [],
  currentUserId,
}) => {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messagesByConversation, setMessagesByConversation] =
    useState(initialMessages);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );

  const messages = selectedConversationId
    ? (messagesByConversation[selectedConversationId] ?? [])
    : [];

  // an existing chat reopens, anyone else gets a conversation of their own
  const handleStartConversation = (contact) => {
    setConversations((previous) =>
      previous.some((conversation) => conversation.id === contact.id)
        ? previous
        : [
            {
              id: contact.id,
              name: contact.name,
              company: contact.company ?? "",
              lastMessage: "",
              lastMessageTime: "",
              unreadCount: 0,
              avatar: contact.avatar,
              status: contact.status ?? "offline",
            },
            ...previous,
          ],
    );

    setSelectedConversationId(contact.id);
  };

  const handleSendMessage = (text, file, voiceNote) => {
    const newMessage = {
      id: crypto.randomUUID(),
      senderId: currentUserId,
      text,
      attachment: file ? file.name : null,
      voiceNote: voiceNote ? { url: voiceNote.url, duration: voiceNote.duration } : null,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    if (!selectedConversationId) return;

    setMessagesByConversation((previous) => ({
      ...previous,
      [selectedConversationId]: [
        ...(previous[selectedConversationId] ?? []),
        newMessage,
      ],
    }));
  };

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] flex-col bg-white lg:-m-6 lg:h-[calc(100%+3rem)]">
      <div className="flex min-h-0 flex-1">
        {/* message list  */}
        <section
          className={`w-full shrink-0 border-gray-200 md:block md:w-70 md:border-r ${
            selectedConversation ? "hidden" : "block"
          }`}
        >
          <ConversationSidebar
            conversations={conversations}
            contacts={contacts}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
            onStartConversation={handleStartConversation}
          />
        </section>

        {/* Chat Area */}
        <section
          className={`flex-1 md:block ${
            selectedConversation ? "block" : "hidden"
          }`}
        >
          <ChatPanel
            conversation={selectedConversation}
            messages={messages}
            currentUserId={currentUserId}
            onSend={handleSendMessage}
            onBack={() => setSelectedConversationId(null)}
          />
        </section>
      </div>
    </div>
  );
};

export default MessagesView;
