import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, currentUserId }) => {
  return (
    <div className="flex flex-col gap-3 px-4 py-5 sm:px-5">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwnMessage={message.senderId === currentUserId}
        />
      ))}
    </div>
  );
};

export default MessageList;
