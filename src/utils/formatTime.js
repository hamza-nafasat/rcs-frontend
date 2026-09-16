// time today, date when older
const formatChatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const isToday = date.toDateString() === new Date().toDateString();

  return isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { day: "numeric", month: "short" });
};

export { formatChatTime };
