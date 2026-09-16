import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import Avatar from "./Avatar";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useLogoutMutation } from "../../store/apis/shared/auth.apis";

const UserMenu = ({ name, type = "admin" }) => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleSignOut = async () => {
    try {
      const res = await logout().unwrap();
      if (res?.success) navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const profilePath =
    type === "user"
      ? "/user/dashboard/settings"
      : type === "client"
        ? "/client/dashboard/settings"
        : "/admin/dashboard/settings";
  const options = [
    {
      label: "My Profile",
      icon: <UserRound size={16} />,
      onClick: () => navigate(profilePath),
    },
    {
      label: "Sign out",
      icon: <LogOut size={16} />,
      onClick: handleSignOut,
    },
  ];
  return (
    <Dropdown
      trigger={
        <div className="flex items-center gap-2 border border-[#E8E8E8] rounded-xl px-2 py-1 hover:bg-gray-50 cursor-pointer">
          <Avatar name={name} size={32} />

          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-tertiary">{name}</p>
          </div>

          <ChevronDown size={16} className="cursor-pointer" />
        </div>
      }
    >
      {options.map((option, index) => (
        <button
          type="button"
          key={index}
          className="w-full rounded-lg px-2 py-2 text-tertiary text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
          onClick={option.onClick}
        >
          {option.icon && <span className="text-secondary">{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </Dropdown>
  );
};

export default UserMenu;
