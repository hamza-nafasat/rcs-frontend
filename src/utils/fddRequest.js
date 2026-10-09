const FDD_FIELDS = ["title", "version", "restaurant", "country", "state", "isFillRequired"];

// the pdf travels with the fields
const toFddFormData = (form) => {
  const body = new FormData();
  FDD_FIELDS.forEach((field) => body.append(field, form?.[field] ?? ""));
  if (form?.file) body.append("file", form.file);
  return body;
};

const toFilledFormData = (filledFile, document) => {
  const body = new FormData();
  body.append("file", filledFile, toFddFileName(document));
  return body;
};

// my signed copy, else the original
const toFddFileUrl = (document) => document?.myFill?.file?.url ?? document?.file?.url;

const toFddFileName = (document) => document?.file?.name ?? `${document?.title ?? "document"}.pdf`;

export { toFddFileName, toFddFileUrl, toFddFormData, toFilledFormData };
