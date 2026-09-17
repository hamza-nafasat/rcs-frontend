const TICKET_FIELDS = ["subject", "description", "category", "priority"];

// the file travels with the fields
const toTicketFormData = (form) => {
  const body = new FormData();
  TICKET_FIELDS.forEach((field) => {
    if (form?.[field]) body.append(field, form[field]);
  });

  // only a newly picked file uploads
  if (form?.attachment instanceof File) body.append("file", form.attachment);
  return body;
};

export { toTicketFormData };
