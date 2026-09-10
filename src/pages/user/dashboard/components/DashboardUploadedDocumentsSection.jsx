import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Upload,
  FolderCheck,
} from "lucide-react";
import Button from "../../../../components/shared/Button";

// Initial mock uploaded documents submitted with the franchise request
const INITIAL_DOCUMENTS = [
  {
    id: "doc-1",
    title: "Financial Statement & Proof of Net Worth",
    fileName: "financial_statement_2026.pdf",
    fileSize: "2.4 MB",
    category: "Financial",
    uploadedDate: "12 Aug 2026",
    status: "Verified",
    url: "#",
  },
  {
    id: "doc-2",
    title: "Bank Capital Proof & Liquid Funds Statement",
    fileName: "liquid_capital_proof.pdf",
    fileSize: "1.8 MB",
    category: "Financial",
    uploadedDate: "12 Aug 2026",
    status: "Verified",
    url: "#",
  },
  {
    id: "doc-3",
    title: "Government ID / Passport Verification",
    fileName: "identity_verification_id.pdf",
    fileSize: "920 KB",
    category: "Identity",
    uploadedDate: "12 Aug 2026",
    status: "Verified",
    url: "#",
  },
  {
    id: "doc-4",
    title: "Proposed Location & Territory Business Plan",
    fileName: "austin_tx_territory_plan.pdf",
    fileSize: "4.1 MB",
    category: "Location Plan",
    uploadedDate: "14 Aug 2026",
    status: "Under Review",
    url: "#",
  },
  {
    id: "doc-5",
    title: "Signed FDD Receipt & Acknowledgment",
    fileName: "fdd_signed_acknowledgment.pdf",
    fileSize: "1.2 MB",
    category: "Legal",
    uploadedDate: "15 Aug 2026",
    status: "Verified",
    url: "#",
  },
];

const DashboardUploadedDocumentsSection = ({
  documents = INITIAL_DOCUMENTS,
  showUploadButton = true,
  className = "",
}) => {
  const [docList] = useState(documents);
  const [viewingDoc, setViewingDoc] = useState(null);

  const getStatusBadge = (status) => {
    if (status === "Verified") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={12} className="text-emerald-600" />
          Verified
        </span>
      );
    }
    if (status === "Under Review") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock size={12} className="text-amber-600" />
          Under Review
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
        Pending
      </span>
    );
  };

  return (
    <section
      className={`flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-xs border border-gray-200 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <FolderCheck size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Uploaded Application Documents
            </h3>
            <p className="text-xs text-gray-500">
              Documents submitted with your franchise request
            </p>
          </div>
        </div>

        {/* Render Upload Button ONLY if admin has requested a document to upload */}
        {showUploadButton && (
          <Button
            type="button"
            icon={<Upload size={14} />}
            className="self-start sm:self-auto px-3.5 py-2 text-xs flex items-center gap-2 text-white rounded-lg transition"
            onClick={() => console.log("Upload Document")}
          >
            Upload Document
          </Button>
        )}
      </div>

      {/* Document Items Grid / List */}
      <div className="grid grid-cols-1 gap-3">
        {docList.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-100 shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {doc.title}
                  </h4>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-200/60 text-gray-600">
                    {doc.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="font-mono text-[11px] text-gray-600">
                    {doc.fileName}
                  </span>
                  <span>•</span>
                  <span>{doc.fileSize}</span>
                  <span>•</span>
                  <span>Uploaded {doc.uploadedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
              {getStatusBadge(doc.status)}

              <div className="flex items-center justify-center gap-1">
                <Button
                  type="button"
                  className="p-1.5 bg-transparent text-secondary rounded-md transition"
                  title="Preview Document"
                  onClick={() => setViewingDoc(doc)}
                >
                  <Eye size={16} />
                </Button>
                <Button
                  type="button"
                  className="p-1.5 bg-transparent text-secondary rounded-md transition"
                  title="Download Document"
                  onClick={() =>
                    console.log("Download Document")
                  }
                >
                  <Download size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl flex flex-col gap-4 border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {viewingDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 py-2 text-sm text-gray-600">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="font-medium text-gray-500">File Name:</span>
                <span className="font-mono text-gray-900">{viewingDoc.fileName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="font-medium text-gray-500">Category:</span>
                <span className="text-gray-900">{viewingDoc.category}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="font-medium text-gray-500">File Size:</span>
                <span className="text-gray-900">{viewingDoc.fileSize}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="font-medium text-gray-500">Upload Date:</span>
                <span className="text-gray-900">{viewingDoc.uploadedDate}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-medium text-gray-500">Verification Status:</span>
                {getStatusBadge(viewingDoc.status)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <Button
                type="button"
                icon={<Download size={14} />}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-1.5"
                onClick={() => console.log("Download File")}
              >
                Download File
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardUploadedDocumentsSection;
