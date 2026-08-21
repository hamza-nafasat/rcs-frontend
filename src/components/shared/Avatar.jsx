import { useState } from "react";

const COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
];

function getColorFromName(name = "") {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % COLORS.length;

  return COLORS[index];
}

export default function Avatar({
  src,
  name = "",
  size = 40,
  rounded = "rounded-full",
  color,
  className = "",
}) {
  const [imgError, setImgError] = useState(false);

  const initials = (name || "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  const dimension = `${size}px`;

  const fontSize = initials.length > 2 ? `${size * 0.3}px` : `${size * 0.38}px`;

  if (!src || imgError) {
    const bgClass = color ? "" : getColorFromName(name);

    return (
      <div
        style={{
          width: dimension,
          height: dimension,
          fontSize,
          backgroundColor: color,
        }}
        className={`shrink-0 ${name == "Marco" ? "bg-orange-500" : bgClass} text-white ${rounded} flex items-center justify-center font-semibold ${className}`}
      >
        {initials || "?"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      style={{ width: dimension, height: dimension }}
      className={`shrink-0 ${rounded} object-cover bg-gray-200 ${className}`}
      onError={() => setImgError(true)}
    />
  );
}
