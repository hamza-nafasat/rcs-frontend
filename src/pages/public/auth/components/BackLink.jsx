import { Link } from "react-router-dom";
import LessIcon from "../../../../assets/SVGs/LessIcon.svg";

export default function BackLink({
  text = "",
  to = "",
  className = "",
  isLessIcon = true,
}) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-black ${className}`}
    >
      {isLessIcon && (
        <img src={LessIcon} alt="less icon" className="h-3 w-3 mt-0.5" />
      )}
      <span className="text-primary">{text}</span>
    </Link>
  );
}
