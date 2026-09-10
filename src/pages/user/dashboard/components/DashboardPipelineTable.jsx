import { useState } from "react";
import { initialApplicants } from "../utils/data";
import DashboardApplicantProgress from "./DashboardApplicantProgress";
import DashboardDocumentRequestCard from "./DashboardDocumentRequestCard";
import DashboardApplicantScorecardSection from "./DashboardApplicantScorecardSection";
import DashboardUploadedDocumentsSection from "./DashboardUploadedDocumentsSection";

const DashboardPipelineTable = () => {
  const [applicants] = useState(initialApplicants);
  const [hasAdminRequest, setHasAdminRequest] = useState(true);

  const userApplication = applicants.slice(0, 1);
  const currentApplicant = userApplication[0];

  return (
    <section className="flex flex-col gap-6">
      {/* Application Progress Stage Overview */}
      <DashboardApplicantProgress currentStage={currentApplicant?.stage} />

      {/* Admin Document Request Status Card (Positioned directly below Application Progress) */}
      <DashboardDocumentRequestCard
        hasRequest={hasAdminRequest}
        onRequestToggle={setHasAdminRequest}
      />

      {/* Applicant Scorecard Details */}
      <DashboardApplicantScorecardSection applicant={currentApplicant} />

      {/* Uploaded Application Documents */}
      <DashboardUploadedDocumentsSection showUploadButton={hasAdminRequest} />
    </section>
  );
};

export default DashboardPipelineTable;
