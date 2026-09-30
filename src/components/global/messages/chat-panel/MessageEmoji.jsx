import { useState } from "react";
import { Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const MessageEmoji = ({ onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiData) => {
    onEmojiSelect(emojiData.emoji);
    setIsOpen(false);
  };

  return (
    <div className="shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 transition-colors hover:text-gray-600"
        aria-label="Add emoji"
      >
        <Smile className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-4 z-10 sm:left-5">
          <EmojiPicker onEmojiClick={handleEmojiClick} height={320} width={280} />
        </div>
      )}
    </div>
  );
};

export default MessageEmoji;
