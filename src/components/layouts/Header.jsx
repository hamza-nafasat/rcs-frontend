import { Menu } from "lucide-react";
import UserMenu from "../shared/UserMenu";
import Breadcrumb from "../shared/Breadcrumb";
import Button from "../shared/Button";
import NotificationBell from "../shared/NotificationBell";

const Header = ({ onMenuClick, type = "admin" }) => {
  return (
    <header
      className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6"
      style={{ borderColor: "var(--color-border)" }}
    >
      <Button
        variant="bare"
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
        <NotificationBell type={type} />

        {/* User Menu */}
        <UserMenu name="Marco" type={type} />
      </div>
    </header>
  );
};

export default Header;
