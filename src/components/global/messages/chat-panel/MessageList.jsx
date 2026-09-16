import Loader from "../../../shared/Loader";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages = [], currentUserId, isLoading = false, onDeleteMessage }) => {
  if (isLoading) return <Loader className="min-h-40!" />;

  if (messages.length === 0)
    return <p className="px-4 py-8 text-center text-sm text-gray-400">No messages yet, say hello</p>;

  return (
    <div className="flex flex-col gap-3 px-4 py-5 sm:px-5">
      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
          isOwnMessage={String(message.sender) === String(currentUserId)}
          onDelete={onDeleteMessage}
        />
      ))}
    </div>
  );
};

export default MessageList;
