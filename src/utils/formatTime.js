// 9 Oct 2026
const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "";

// 11:16 AM
const formatClockTime = (value) =>
  value ? new Date(value).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "";

// date and time, always 12 hour
const formatChatDateTime = (value) => (value ? `${formatDate(value)}, ${formatClockTime(value)}` : "");

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

export { formatChatDateTime, formatClockTime, formatDate, formatRelativeTime };
