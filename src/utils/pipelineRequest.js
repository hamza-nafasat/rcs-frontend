// multer reads the files field
const appendFiles = (body, files = []) => files.forEach((file) => body.append("files", file));

// what the admin sends or edits
const toRequestFormData = ({ title, message, status, files = [] }) => {
  const body = new FormData();

  if (title) body.append("title", title);
  if (message) body.append("message", message);
  if (status) body.append("status", status);
  appendFiles(body, files);

  return body;
};

// what the applicant sends back
const toResponseFormData = ({ message, files = [] }) => {
  const body = new FormData();

  body.append("message", message);
  appendFiles(body, files);

  return body;
};

// a pin with no database id
const firstNewFranchise = (franchises = []) => franchises.find((franchise) => !franchise._id) ?? null;

export { firstNewFranchise, toRequestFormData, toResponseFormData };
