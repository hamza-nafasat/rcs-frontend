import { Paperclip, Trash2 } from "lucide-react";
import { formatChatTime } from "../../../../utils/formatTime";
import { formatDuration } from "../../../../utils/formatDuration";

const MessageBubble = ({ message, isOwnMessage, onDelete }) => {
  const { text, attachment, attachmentType, duration, createdAt } = message;

  return (
    <div className={`group flex items-center gap-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      {isOwnMessage && (
        <button
          type="button"
          onClick={() => onDelete?.(message)}
          aria-label="Delete message"
          className="shrink-0 rounded-full border color-border bg-white p-1.5 text-secondary opacity-0 shadow-sm transition hover:border-cancel hover:text-remove focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}

      <div
        className={`min-w-0 max-w-[80%] rounded-2xl px-4 py-2.5 sm:max-w-[70%] ${
          isOwnMessage ? "rounded-br-md bg-orange-500 text-white" : "rounded-bl-md bg-gray-100 text-gray-900"
        }`}
      >
        {text && <p className="whitespace-pre-wrap break-words text-sm leading-5">{text}</p>}

        {attachmentType === "image" && (
          <img src={attachment?.url} alt={attachment?.name} className="mt-1 max-h-60 rounded-lg" />
        )}

        {attachmentType === "voice" && (
          <div className="mt-1 flex items-center gap-2">
            <audio controls src={attachment?.url} className="h-9 w-48 min-w-0 max-w-full" />
            <span className="shrink-0 text-[10px] tabular-nums">{formatDuration(duration ?? 0)}</span>
          </div>
        )}

        {attachmentType === "file" && (
          <a
            href={attachment?.url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 flex items-center gap-1.5 text-xs underline"
          >
            <Paperclip className="h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0 break-all">{attachment?.name}</span>
          </a>
        )}

        <p className={`mt-1 text-[10px] ${isOwnMessage ? "text-orange-100" : "text-gray-400"}`}>
          {formatChatTime(createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
