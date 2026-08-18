import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Award,
  Settings,
  Bell,
  HelpCircle,
  X,
  ChevronLeft,
} from "lucide-react";
import Logo from "../../assets/SVGs/Logo.svg";
import Avatar from "../shared/Avatar";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", to: "/dashboard/clients", icon: BarChart3 },
  { label: "Messages", to: "/dashboard/messages", icon: MessageSquare },
  { label: "Moderators", to: "/dashboard/moderators", icon: Award },
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

const linkClass =
  (isCollapsed) =>
  ({ isActive }) =>
    `flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors ${
      isCollapsed ? "lg:justify-center lg:px-0 px-3" : "px-3"
    } ${
      isActive
        ? "bg-primary text-primary"
        : "text-secondary hover:bg-(--color-bg-primary)"
    }`;

const SectionTitle = ({ children, isCollapsed }) => (
  <p
    className={`px-3 pb-2 text-xs font-semibold uppercase tracking-wider ${
      isCollapsed ? "lg:hidden" : ""
    }`}
    style={{ color: "var(--color-sidebar-section)" }}
  >
    {children}
  </p>
);

const Sidebar = ({ isOpen, onClose, user, isCollapsed, onToggleCollapse }) => {
  const hideOnCollapse = isCollapsed ? "lg:hidden" : "";
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/40 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r bg-dark transition-all duration-200 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "lg:w-20" : ""}`}
        style={{ borderColor: "var(--color-border)" }}
      >
        <button
          type="button"
          onClick={onToggleCollapse}
          className="absolute -right-3 top-8 z-50 hidden h-6 w-6 items-center justify-center rounded-full border bg-dark text-secondary transition-colors hover:bg-(--color-bg-primary) lg:flex"
          style={{ borderColor: "var(--color-border)" }}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            size={14}
            className={`transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`flex h-16 items-center px-5 ${
            isCollapsed ? "lg:justify-center lg:px-0" : "justify-between"
          }`}
        >
          <img
            src={Logo}
            alt="Logo"
            className={`h-30 ${isCollapsed ? "lg:hidden" : ""}`}
          />
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
          <SectionTitle isCollapsed={isCollapsed}>Menu</SectionTitle>
          <div className="space-y-1">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                end={to === "/dashboard"}
                onClick={onClose}
                className={linkClass(isCollapsed)}
                title={isCollapsed ? label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                <span className={hideOnCollapse}>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="px-3 pb-4">
          <SectionTitle isCollapsed={isCollapsed}>Profile</SectionTitle>
          <div className="space-y-1">
            {profileItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                onClick={onClose}
                className={linkClass(isCollapsed)}
                title={isCollapsed ? label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                <span className={hideOnCollapse}>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div
          className="border-t px-3 py-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className={`flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-(--color-bg-primary) cursor-pointer ${
              isCollapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <Avatar name={user?.name || "Faiza"} size={34} />
            <div className={`min-w-0 flex-1 ${hideOnCollapse}`}>
              <p className="truncate text-sm font-medium text-white">
                {user?.name || "Faiza"}
              </p>
              <p className="truncate text-xs text-muted">
                {user?.email || "faiza@example.com"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
