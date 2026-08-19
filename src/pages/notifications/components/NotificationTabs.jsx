const TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
];

const NotificationTabs = ({ activeTab, setActiveTab, unreadCount = 0 }) => {
  return (
    <div className="flex items-center gap-2">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-(--color-primary) text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}

            {tab.key === "unread" && unreadCount > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  isActive ? "bg-white/20" : "bg-white text-gray-700"
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default NotificationTabs;
