import Dropdown from "./Dropdown";
import Avatar from "./Avatar";
import { ChevronDown, LogOut, UserRound } from "lucide-react";

const UserMenu = ({ name }) => {
  const options = [
    {
      label: "Sign out",
      icon: <LogOut />,
      onClick: () => console.log("Sign out clicked"),
    },
    {
      label: "My Profile",
      icon: <UserRound />,
      onClick: () => console.log("My Profile clicked"),
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
