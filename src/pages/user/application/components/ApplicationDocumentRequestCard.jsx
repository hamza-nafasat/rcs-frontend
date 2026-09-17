import {
  FileQuestion,
  FileCheck2,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";

const ApplicationDocumentRequestCard = ({
  hasRequest = true,
  onRequestToggle,
  requestDetails = {
    documentName: "Updated 2026 Tax Return & Proof of Address",
    requestedBy: "Admin Reviewer",
    dateRequested: "08 Sep 2026",
    note: "Please upload your signed 2026 Tax Return and utility bill for address verification to proceed to the next stage.",
  },
}) => {
  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-xs border color-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border shrink-0 ${hasRequest
              ? "bg-amber-50 text-amber-600 border-amber-200"
              : "bg-emerald-50 text-emerald-600 border-emerald-200"
              }`}
          >
            {hasRequest ? (
              <FileQuestion size={22} />
            ) : (
              <FileCheck2 size={22} />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-tertiary">
                {hasRequest
                  ? "Admin Document Request"
                  : "Admin Document Request Status"}
              </h3>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${hasRequest
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-emerald-100 text-emerald-800 border-emerald-300"
                  }`}
              >
                {hasRequest ? "Action Required" : "No Request"}
              </span>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              {hasRequest
                ? "Admin has requested additional documentation for your application."
                : "No pending document requests from the admin at this time."}
            </p>
          </div>
        </div>

        {/* Demo Toggle Button so user can switch states freely */}
        <button
          type="button"
          onClick={() => onRequestToggle?.(!hasRequest)}
          className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg border border-cancel bg-muted hover:bg-active text-cancel transition"
        >
          Toggle Demo State ({hasRequest ? "Simulate No Request" : "Simulate Admin Request"})
        </button>
      </div>

      {/* Content based on Admin Request state */}
      {hasRequest ? (
        <div className="mt-2 p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertCircle size={15} className="text-amber-600" />
              Requested Item: {requestDetails.documentName}
            </span>
            <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
              <Clock size={13} /> Requested on {requestDetails.dateRequested}
            </span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            {requestDetails.note}
          </p>
          <p className="text-xs font-medium text-amber-900 mt-1">
            ➔ Use the <span className="font-bold underline">Upload Document</span> button in the Uploaded Application Documents section below to fulfill this request.
          </p>
        </div>
      ) : (
        <div className="mt-1 p-3.5 rounded-xl border color-border bg-muted flex items-center gap-2.5 text-secondary text-xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>
            <strong className="text-tertiary font-semibold">No Request:</strong> All required documents are up to date. The upload button in the documents section is hidden until requested by admin.
          </span>
        </div>
      )}
    </section>
  );
};

export default ApplicationDocumentRequestCard;
