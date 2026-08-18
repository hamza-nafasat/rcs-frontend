const MessageBubble = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
          isOwnMessage
            ? "rounded-br-md bg-orange-500 text-white"
            : "rounded-bl-md bg-gray-100 text-gray-900"
        }`}
      >
        {message.text && <p className="text-sm leading-5">{message.text}</p>}

        {message.attachment && (
          <p className="mt-1 text-xs underline">{message.attachment}</p>
        )}

        <p
          className={`mt-1 text-[10px] ${
            isOwnMessage ? "text-orange-100" : "text-gray-400"
          }`}
        >
          {message.time}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
