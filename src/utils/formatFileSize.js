const KB = 1024;

// bytes as KB or MB
const formatFileSize = (bytes = 0) => {
  // rounded first, so KB never overflows
  const kilobytes = Math.max(1, Math.round(bytes / KB));
  return kilobytes < KB ? `${kilobytes} KB` : `${(bytes / (KB * KB)).toFixed(1)} MB`;
};

export { formatFileSize };
