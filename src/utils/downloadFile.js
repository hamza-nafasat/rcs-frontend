// a browser only downloads a file through an anchor click, and it ignores
// the download name on another origin, so the file is fetched first
const downloadFile = async (url, name = "document.pdf") => {
  if (!url) return;

  const blob = await fetch(url).then((response) => response.blob());
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};

export { downloadFile };
