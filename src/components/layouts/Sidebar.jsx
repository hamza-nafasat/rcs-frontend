import {
  Award,
  Bell,
  ChevronLeft,
  FileChartColumn,
  FileIcon,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  UserSquare,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import LogoCompany from "../../assets/SVGs/LogoCompany.svg";
import SidebarClosedLogo from "../../assets/SVGs/SidebarClosedLogo.svg";
import Avatar from "../shared/Avatar";

const adminNavItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Clients", to: "/admin/dashboard/clients", icon: Users },
  { label: "Messages", to: "/admin/dashboard/messages", icon: MessageSquare },
  { label: "Moderators", to: "/admin/dashboard/moderators", icon: Award },
  { label: "FDD", to: "/admin/dashboard/fdd", icon: FileIcon },
  {
    label: "Pipeline",
    to: "/admin/dashboard/pipeline",
    icon: Settings,
  },
];

const adminProfileItems = [
  { label: "Notifications", to: "/admin/dashboard/notifications", icon: Bell },
  { label: "Support", to: "/admin/dashboard/support", icon: HelpCircle },
];

const clientNavItems = [
  { label: "Overview", to: "/client/dashboard", icon: LayoutDashboard },
  { label: "Pipeline", to: "/client/dashboard/pipeline", icon: Award },
  { label: "Reports", to: "/client/dashboard/reports", icon: FileChartColumn },
  { label: "Messages", to: "/client/dashboard/messages", icon: MessageSquare },
  { label: "Moderators", to: "/client/dashboard/moderators", icon: Award },
  { label: "FDD", to: "/client/dashboard/fdd", icon: FileIcon },
  { label: "Franchisee", to: "/client/dashboard/franchisee", icon: UserSquare },
];

const clientProfileItems = [
  { label: "Notifications", to: "/client/dashboard/notifications", icon: Bell },
  { label: "Support", to: "/client/dashboard/support", icon: HelpCircle },
];

const userNavItems = [
  { label: "My Application", to: "/user/dashboard", icon: LayoutDashboard },
  { label: "Messages", to: "/user/dashboard/messages", icon: MessageSquare },

];

const userProfileItems = [
  { label: "Notifications", to: "/user/dashboard/notifications", icon: Bell },
  { label: "Support", to: "/user/dashboard/support", icon: HelpCircle },

];

const linkClass =
  (isCollapsed) =>
    ({ isActive }) =>
      `flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors ${isCollapsed ? "lg:justify-center lg:px-0 px-3" : "px-3"
      } ${isActive
        ? "bg-primary text-primary"
        : "text-secondary hover:bg-(--color-bg-primary) hover:text-[#fefefe]!  "
      }`;

const SectionTitle = ({ children, isCollapsed }) => (
  <p
    className={`px-3 pb-2 text-xs font-semibold uppercase tracking-wider ${isCollapsed ? "lg:hidden" : ""
      }`}
    style={{ color: "var(--color-sidebar-section)" }}
  >
    {children}
  </p>
);

const Sidebar = ({
  isOpen,
  onClose,
  user,
  isCollapsed,
  onToggleCollapse,
  type = "admin",
}) => {
  const hideOnCollapse = isCollapsed ? "lg:hidden" : "";
  const isClient = type === "client";
  const isUser = type === "user";

  // Define menu items based on user type
  const menuItems = isUser ? userNavItems : isClient ? clientNavItems : adminNavItems;
  const profileLinks = isUser ? userProfileItems : isClient ? clientProfileItems : adminProfileItems;
  const homePath = isUser ? "/user/dashboard" : isClient ? "/client/dashboard" : "/admin/dashboard";
  const settingsPath = isUser
    ? "/user/dashboard/settings"
    : isClient
      ? "/client/dashboard/settings"
      : "/admin/dashboard/settings";
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/40 lg:hidden ${isOpen ? "block" : "hidden"
          }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r bg-dark transition-all duration-200 lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
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
            className={`transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""
              }`}
          />
        </button>

        <div
          className={`flex h-16 items-center px-5 ${isCollapsed ? "lg:justify-center lg:px-0" : "justify-between"
            }`}
        >
          <div className="relative flex h-16 items-center">
            <img
              src={LogoCompany}
              alt="Logo"
              className={`h-12 transition-opacity duration-200 ${isCollapsed
                ? "lg:pointer-events-none lg:opacity-0"
                : "opacity-100"
                }`}
            />
            <img
              src={SidebarClosedLogo}
              alt="Logo"
              className={`absolute left-1/2 top-1/2 h-8 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${isCollapsed
                ? "opacity-0 lg:opacity-100"
                : "pointer-events-none opacity-0"
                }`}
            />
          </div>
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
            {menuItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                end={to === homePath}
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
          <SectionTitle isCollapsed={isCollapsed}>Manage</SectionTitle>
          <div className="space-y-1">
            {profileLinks.map(({ label, to, icon: Icon }) => (
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

        <NavLink
          to={settingsPath}
          onClick={onClose}
          className={`border-t border-gray-600 px-3 py-4 block ${isCollapsed ? "lg:px-0" : ""
            }`}
        >
          <div
            className={`flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-(--color-bg-primary) cursor-pointer ${isCollapsed ? "lg:justify-center lg:px-0" : ""
              }`}
          >
            <Avatar name={user?.name || "Marco"} size={34} />
            <div className={`min-w-0 flex-1 ${hideOnCollapse}`}>
              <p className="truncate text-sm font-medium text-white">
                {user?.name || "Marco"}
              </p>
              <p className="truncate text-xs text-muted">
                {user?.email || "marco@example.com"}
              </p>
            </div>
          </div>
        </NavLink>
      </aside>
    </>
  );
};

export default Sidebar;
