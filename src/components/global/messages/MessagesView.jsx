import ConversationSidebar from "./conversation-sidebar/ConversationSidebar";
import ChatPanel from "./chat-panel/ChatPanel";

const MessagesView = ({
  conversations = [],
  contacts = [],
  messages = [],
  currentUserId,
  selectedConversation,
  isLoadingConversations = false,
  isLoadingMessages = false,
  isSending = false,
  draft = "",
  onSelectConversation,
  onStartConversation,
  onDeleteConversation,
  onSend,
  onDeleteMessage,
  onBack,
}) => {
  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] flex-col bg-white lg:-m-6 lg:h-[calc(100%+3rem)]">
      <div className="flex min-h-0 flex-1">
        {/* Conversations */}
        <section
          className={`w-full shrink-0 border-gray-200 md:block md:w-70 md:border-r ${
            selectedConversation ? "hidden" : "block"
          }`}
        >
          <ConversationSidebar
            conversations={conversations}
            contacts={contacts}
            isLoading={isLoadingConversations}
            selectedConversationId={selectedConversation?._id}
            onSelectConversation={onSelectConversation}
            onStartConversation={onStartConversation}
            onDeleteConversation={onDeleteConversation}
          />
        </section>

        {/* Chat Area */}
        <section className={`min-w-0 flex-1 md:block ${selectedConversation ? "block" : "hidden"}`}>
          <ChatPanel
            conversation={selectedConversation}
            messages={messages}
            currentUserId={currentUserId}
            isLoading={isLoadingMessages}
            isSending={isSending}
            draft={draft}
            onSend={onSend}
            onDeleteMessage={onDeleteMessage}
            onBack={onBack}
          />
        </section>
      </div>
    </div>
  );
};

export default MessagesView;
