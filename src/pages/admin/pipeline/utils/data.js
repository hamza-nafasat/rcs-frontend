export const initialRequests = [
  {
    _id: "req-1",
    title: "Updated 2026 Tax Return",
    message: "Please upload your signed 2026 tax return so we can verify the declared net worth.",
    files: [
      { name: "tax_return_checklist.pdf", size: "240 KB", url: "data:text/plain;charset=utf-8,Sample%20tax%20return%20checklist." },
      { name: "sample_w2_form.pdf", size: "180 KB", url: "data:text/plain;charset=utf-8,Sample%20W2%20form." },
    ],
    status: "approved",
    createdAt: "2026-09-08T10:15:00.000Z",
  },
  {
    _id: "req-2",
    title: "Proof of Address",
    message: "A recent utility bill or bank statement showing your current residential address.",
    files: [],
    status: "filled",
    response: {
      message: "Attached is my latest utility bill showing my current address.",
      files: [{ name: "utility_bill_sept.pdf", size: "310 KB", url: "data:text/plain;charset=utf-8,Sample%20utility%20bill." }],
      submittedAt: "2026-09-11T08:20:00.000Z",
    },
    createdAt: "2026-09-10T09:00:00.000Z",
  },
  {
    _id: "req-3",
    title: "Signed Franchise Disclosure Receipt",
    message: "Sign the attached FDD receipt and send it back before we move you to the agreement stage.",
    files: [
      { name: "fdd_receipt_template.pdf", size: "1.2 MB", url: "data:text/plain;charset=utf-8,Sample%20FDD%20receipt%20template." },
    ],
    status: "pending",
    createdAt: "2026-09-14T14:30:00.000Z",
  },
];
