import { useState } from "react";
import ConversationSidebar from "./conversation-sidebar/ConversationSidebar";
import ChatPanel from "./chat-panel/ChatPanel";
import { conversations, initialMessagesByConversation } from "./messagesData";

const MessagesView = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messagesByConversation, setMessagesByConversation] = useState(
    initialMessagesByConversation,
  );

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );

  const currentUserId = "admin-1";

  const messages = selectedConversationId
    ? (messagesByConversation[selectedConversationId] ?? [])
    : [];

  const handleSendMessage = (text, file) => {
    const newMessage = {
      id: crypto.randomUUID(),
      senderId: currentUserId,
      text,
      attachment: file ? file.name : null,
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
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
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
