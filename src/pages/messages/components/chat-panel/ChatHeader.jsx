import Avatar from "../../../../components/shared/Avatar";

const ChatHeader = ({ conversation }) => {
  const { name, company, avatar, status } = conversation;

  return (
    <header className="flex items-center gap-3 border-b border-gray-200 px-5 py-4">
      <div className="relative shrink-0">
        <Avatar src={avatar} name={name} size={40} rounded="rounded-full" />

        {status === "online" && (
          <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
        )}
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-gray-900">{name}</h2>

        <p className="truncate text-xs text-gray-500">{company}</p>
      </div>
    </header>
  );
};

export default ChatHeader;
