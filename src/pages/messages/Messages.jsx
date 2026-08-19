import { useState } from "react";
import ConversationSidebar from "./components/conversation-sidebar/ConversationSidebar";
import ChatPanel from "./components/chat-panel/ChatPanel";

const conversations = [
  {
    id: "1",
    name: "Marco Ricci",
    initials: "MR",
    company: "The Golden Fork",
    lastMessage: "Can we review the branding deck tomorrow?",
    lastMessageTime: "2m ago",
    unreadCount: 2,
    avatarColor: "bg-orange-500",
    status: "online",
  },
  {
    id: "2",
    name: "Ravi Kapoor",
    initials: "RK",
    company: "Spice Route",
    lastMessage: "The kitchen audit report was very helpful.",
    lastMessageTime: "1h ago",
    unreadCount: 0,
    avatarColor: "bg-red-500",
    status: "offline",
  },
  {
    id: "3",
    name: "Julia Chen",
    initials: "JC",
    company: "Urban Eats",
    lastMessage: "Looking forward to our tasting session next week.",
    lastMessageTime: "7h ago",
    unreadCount: 0,
    avatarColor: "bg-red-500",
    status: "offline",
  },
];

const initialMessages = [
  {
    id: "m1",
    senderId: "client-1",
    text: "Hi Ahmed, hope you're well!",
    attachment: null,
    time: "10:05 AM",
  },
  {
    id: "m2",
    senderId: "admin-1",
    text: "Marco! Great to hear from you. How's everything at The Golden Fork?",
    time: "10:05 AM",
  },
  {
    id: "m3",
    senderId: "client-1",
    text: "Everything is going great. I wanted to discuss the branding deck.",
    time: "10:07 AM",
  },
];

const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState(initialMessages);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );

  const currentUserId = "admin-1";

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

    setMessages((previousMessages) => [...previousMessages, newMessage]);
  };

  return (
    <div className="flex h-full flex-col">
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

export default Messages;
