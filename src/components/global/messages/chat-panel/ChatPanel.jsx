import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageWrite from "./MessageWrite";

const ChatPanel = ({
  conversation,
  messages = [],
  currentUserId,
  isLoading = false,
  isSending = false,
  draft = "",
  onSend,
  onDeleteMessage,
  onBack,
}) => {
  if (!conversation) {
    return (
      <section className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400">Select a conversation to start messaging</p>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      {/* Chat Header */}
      <header className="shrink-0">
        <ChatHeader conversation={conversation} onBack={onBack} />
      </header>

      {/* Messages */}
      <div className="min-h-0 flex-1">
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          isLoading={isLoading}
          onDeleteMessage={onDeleteMessage}
        />
      </div>

      {/* Composer */}
      <footer className="shrink-0">
        <MessageWrite key={conversation?._id} onSend={onSend} isSending={isSending} draft={draft} />
      </footer>
    </section>
  );
};

export default ChatPanel;
