// a browser only downloads a file through an anchor click
const downloadFile = (url, name = "document.pdf") => {
  if (!url) return;
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export { downloadFile };
