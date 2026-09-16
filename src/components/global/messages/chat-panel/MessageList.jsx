import { useLayoutEffect, useRef, useState } from "react";
import DeleteModal from "../../../modals/DeleteModal";
import Loader from "../../../shared/Loader";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages = [], currentUserId, isLoading = false, onDeleteMessage }) => {
  const scrollRef = useRef(null);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // pin the newest message
  useLayoutEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, isLoading]);

  const handleConfirmDelete = () => {
    onDeleteMessage?.(messageToDelete);
    setMessageToDelete(null);
  };

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto">
      {isLoading ? (
        <Loader className="min-h-40!" />
      ) : messages.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-gray-400">No messages yet, say hello</p>
      ) : (
        <div className="flex flex-col gap-3 px-4 py-5 sm:px-5">
          {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwnMessage={String(message.sender) === String(currentUserId)}
              onDelete={setMessageToDelete}
            />
          ))}
        </div>
      )}

      <DeleteModal
        isOpen={Boolean(messageToDelete)}
        onClose={() => setMessageToDelete(null)}
        onConfirm={handleConfirmDelete}
        heading="Delete Message"
        text="This message will be removed for everyone. This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default MessageList;
