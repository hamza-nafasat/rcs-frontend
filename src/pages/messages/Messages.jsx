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

const initialMessagesByConversation = {
  "1": [
    {
      id: "m1-1",
      senderId: "client-1",
      text: "Hi Ahmed, hope you're well!",
      attachment: null,
      time: "10:05 AM",
    },
    {
      id: "m1-2",
      senderId: "admin-1",
      text: "Marco! Great to hear from you. How's everything at The Golden Fork?",
      attachment: null,
      time: "10:05 AM",
    },
    {
      id: "m1-3",
      senderId: "client-1",
      text: "Everything is going great. I wanted to discuss the branding deck.",
      attachment: null,
      time: "10:07 AM",
    },
    {
      id: "m1-4",
      senderId: "admin-1",
      text: "Of course. Are you happy with the direction of the new logo marks?",
      attachment: null,
      time: "10:09 AM",
    },
    {
      id: "m1-5",
      senderId: "client-1",
      text: "The second option feels closest, but the wordmark is a little tight.",
      attachment: null,
      time: "10:12 AM",
    },
    {
      id: "m1-6",
      senderId: "client-1",
      text: "Here are the notes from our team review.",
      attachment: "golden-fork-branding-notes.pdf",
      time: "10:13 AM",
    },
    {
      id: "m1-7",
      senderId: "admin-1",
      text: "Got it, thanks. I'll widen the letter spacing and send a revision.",
      attachment: null,
      time: "10:18 AM",
    },
    {
      id: "m1-8",
      senderId: "admin-1",
      text: "Can we review the branding deck tomorrow?",
      attachment: null,
      time: "10:20 AM",
    },
  ],
  "2": [
    {
      id: "m2-1",
      senderId: "client-2",
      text: "Morning! Did the kitchen audit results come through?",
      attachment: null,
      time: "8:41 AM",
    },
    {
      id: "m2-2",
      senderId: "admin-1",
      text: "They did. Overall score was 92, which is a strong result.",
      attachment: null,
      time: "8:47 AM",
    },
    {
      id: "m2-3",
      senderId: "admin-1",
      text: "Full breakdown is attached for your records.",
      attachment: "spice-route-kitchen-audit.pdf",
      time: "8:48 AM",
    },
    {
      id: "m2-4",
      senderId: "client-2",
      text: "Two items were flagged on cold storage labelling, right?",
      attachment: null,
      time: "9:02 AM",
    },
    {
      id: "m2-5",
      senderId: "admin-1",
      text: "Correct. Both are minor and can be closed out this week.",
      attachment: null,
      time: "9:10 AM",
    },
    {
      id: "m2-6",
      senderId: "client-2",
      text: "I'll brief the shift leads today.",
      attachment: null,
      time: "9:15 AM",
    },
    {
      id: "m2-7",
      senderId: "client-2",
      text: "The kitchen audit report was very helpful.",
      attachment: null,
      time: "9:16 AM",
    },
  ],
  "3": [
    {
      id: "m3-1",
      senderId: "admin-1",
      text: "Hi Julia, the tasting session is confirmed for next Thursday.",
      attachment: null,
      time: "Yesterday",
    },
    {
      id: "m3-2",
      senderId: "client-3",
      text: "Perfect. How many dishes are we sampling?",
      attachment: null,
      time: "Yesterday",
    },
    {
      id: "m3-3",
      senderId: "admin-1",
      text: "Six mains and three desserts from the new seasonal menu.",
      attachment: null,
      time: "Yesterday",
    },
    {
      id: "m3-4",
      senderId: "admin-1",
      text: "Draft menu is attached if you'd like a preview.",
      attachment: "urban-eats-seasonal-menu.pdf",
      time: "Yesterday",
    },
    {
      id: "m3-5",
      senderId: "client-3",
      text: "Thanks! Can we add a vegetarian main to the line-up?",
      attachment: null,
      time: "Yesterday",
    },
    {
      id: "m3-6",
      senderId: "admin-1",
      text: "Already planned; the chef is finalising it this week.",
      attachment: null,
      time: "Yesterday",
    },
    {
      id: "m3-7",
      senderId: "client-3",
      text: "Looking forward to our tasting session next week.",
      attachment: null,
      time: "Yesterday",
    },
  ],
};

const Messages = () => {
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

export default Messages;
