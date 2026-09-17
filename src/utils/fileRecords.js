const KB = 1024;

const readableSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < KB * KB) return `${Math.round(bytes / KB)} KB`;
  return `${(bytes / (KB * KB)).toFixed(1)} MB`;
};

// a picked file downloads from memory
const toFileRecords = (picked = []) =>
  picked.map((item) => ({ name: item.name, size: readableSize(item.size), url: URL.createObjectURL(item) }));

export { readableSize, toFileRecords };
