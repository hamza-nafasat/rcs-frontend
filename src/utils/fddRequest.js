// the fields the api accepts, status only moves on an edit
const FDD_FIELDS = ["title", "version", "client", "country", "state", "isFillRequired"];

// multipart, because the pdf travels with the fields
const toFddFormData = (form, { withStatus = false } = {}) => {
  const body = new FormData();
  FDD_FIELDS.forEach((field) => body.append(field, form?.[field] ?? ""));
  if (withStatus) body.append("status", form?.status ?? "");
  if (form?.file) body.append("file", form.file);
  return body;
};

const toFilledFormData = (filledFile, document) => {
  const body = new FormData();
  body.append("file", filledFile, toFddFileName(document));
  return body;
};

// the signed copy once it exists, otherwise the original
const toFddFileUrl = (document) => document?.currentFile?.url ?? document?.file?.url;

const toFddFileName = (document) => document?.file?.name ?? `${document?.title ?? "document"}.pdf`;

export { toFddFileName, toFddFileUrl, toFddFormData, toFilledFormData };
