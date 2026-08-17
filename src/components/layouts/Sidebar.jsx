import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Target,
  Award,
  Settings,
  Bell,
  HelpCircle,
  X,
} from "lucide-react";
import Logo from "../../assets/SVGs/Logo.svg";
import Icon from "../../assets/SVGs/Icon.svg";
import Avatar from "../shared/Avatar";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", to: "/dashboard/analytics", icon: BarChart3 },
  { label: "Messages", to: "/dashboard/targets", icon: Target },
  { label: "Moderators", to: "/dashboard/badges", icon: Award },
  { label: "FDD", to: "/dashboard/fdd", icon: Settings },
  {
    label: "Franchise Pipeline",
    to: "/dashboard/franchise-pipeline",
    icon: Settings,
  },
];

const profileItems = [
  { label: "Notifications", to: "/dashboard/notifications", icon: Bell },
  { label: "Support", to: "/dashboard/support", icon: HelpCircle },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary text-primary"
      : "text-secondary hover:bg-(--color-bg-primary)"
  }`;

const SectionTitle = ({ children }) => (
  <p
    className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider"
    style={{ color: "var(--color-sidebar-section)" }}
  >
    {children}
  </p>
);

const Sidebar = ({ isOpen, onClose, user }) => {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/40 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r bg-dark transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <img src={Logo} alt="Logo" className="h-30" />
          <button
            type="button"
            onClick={onClose}
            className="text-secondary lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <SectionTitle>Menu</SectionTitle>
          <div className="space-y-1">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                end={to === "/dashboard"}
                onClick={onClose}
                className={linkClass}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="pt-6">
            <SectionTitle>Profile</SectionTitle>
            <div className="space-y-1">
              {profileItems.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={label}
                  to={to}
                  onClick={onClose}
                  className={linkClass}
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <div
          className="border-t px-3 py-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-(--color-bg-primary) cursor-pointer">
            <Avatar name={user?.name || "Faiza"} size={34} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {user?.name || "Faiza"}
              </p>
              <p className="truncate text-xs text-muted">
                {user?.email || "faiza@example.com"}
              </p>
            </div>
            <button
              type="button"
              className="text-secondary shrink-0"
              aria-label="Account options"
            >
              <img src={Icon} alt="" className="cursor-pointer" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
