import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageWrite from "./MessageWrite";

const ChatPanel = ({
  conversation,
  messages,
  currentUserId,
  onSend,
  onBack,
}) => {
  if (!conversation) {
    return (
      <section className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400">
          Select a conversation to start messaging
        </p>
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
      <div className="min-h-0 flex-1 overflow-y-auto">
        <MessageList messages={messages} currentUserId={currentUserId} />
      </div>

      {/* Composer */}
      <footer className="shrink-0">
        <MessageWrite onSend={onSend} />
      </footer>
    </section>
  );
};

export default ChatPanel;
