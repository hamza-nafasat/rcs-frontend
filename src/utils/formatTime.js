// time today, date when older
const formatChatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const isToday = date.toDateString() === new Date().toDateString();

  return isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { day: "numeric", month: "short" });
};

const RELATIVE_UNITS = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

// how long ago it happened
const formatRelativeTime = (value) => {
  if (!value) return "";

  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return "Just now";

  const match = RELATIVE_UNITS.find(([, size]) => seconds >= size);
  if (!match) return "Just now";

  const amount = Math.floor(seconds / match[1]);
  return `${amount} ${match[0]}${amount > 1 ? "s" : ""} ago`;
};

export { formatChatTime, formatRelativeTime };
