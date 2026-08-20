import { Menu, Bell } from "lucide-react";
import UserMenu from "../shared/UserMenu";
import Breadcrumb from "../shared/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";

const Header = ({ onMenuClick, hasNotifications = true }) => {
  const navigate = useNavigate();
  return (
    <header
      className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6"
      style={{ borderColor: "var(--color-border)" }}
    >
      <Button
        type="icon"
        onClick={onMenuClick}
        className="text-secondary lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </Button>

      <div className="min-w-0">
        <div className="mt-0.5 card-heading hidden sm:block">
          <Breadcrumb />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <Button
          type="icon"
          className="relative rounded-xl border border-[#E8E8E8] p-2! text-secondary hover:bg-gray-50"
          aria-label="Notifications"
          title="Notifications"
          onClick={() => navigate("/dashboard/notifications")}
        >
          <Bell size={20} />

          {hasNotifications && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>

        {/* User Menu */}
        <UserMenu name="Faiza" />
      </div>
    </header>
  );
};

export default Header;
