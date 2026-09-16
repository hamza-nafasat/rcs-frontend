import { formatDuration } from "../../../../utils/formatDuration";

const MessageBubble = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl sm:max-w-[70%] px-4 py-2.5 ${
          isOwnMessage
            ? "rounded-br-md bg-orange-500 text-white"
            : "rounded-bl-md bg-gray-100 text-gray-900"
        }`}
      >
        {message.text && <p className="text-sm leading-5">{message.text}</p>}

        {message.attachment && (
          <p className="mt-1 text-xs underline">{message.attachment}</p>
        )}

        {message.voiceNote && (
          <div className="mt-1 flex items-center gap-2">
            <audio controls src={message.voiceNote.url} className="h-9 w-48 max-w-full" />
            <span className="shrink-0 text-[10px] tabular-nums">{formatDuration(message.voiceNote.duration)}</span>
          </div>
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
