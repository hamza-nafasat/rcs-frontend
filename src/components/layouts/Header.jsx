import { Menu, Bell } from "lucide-react";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  return (
    <header
      className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6"
      style={{ borderColor: "var(--color-border)" }}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="text-secondary lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>

      <h1 className="card-heading truncate">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          className="text-secondary"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <div className="h-9 w-9 rounded-full bg-(--color-bg-active)" />
      </div>
    </header>
  );
};

export default Header;
