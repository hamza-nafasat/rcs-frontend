import { useState } from "react";

const MessageWrite = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    onSend(trimmedMessage);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 px-5 py-4"
    >
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type a message... (Enter to send)"
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />

        <button
          type="submit"
          disabled={!message.trim()}
          className="shrink-0 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageWrite;
