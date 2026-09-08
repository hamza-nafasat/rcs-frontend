import { useState } from "react";
import { initialApplicants } from "../../../admin/pipeline/components/pipelineApplicants";
import UserPipelineStageOverview from "./UserPipelineStageOverview";
import AdminDocumentRequestCard from "./AdminDocumentRequestCard";
import UserApplicantScorecardSection from "./UserApplicantScorecardSection";
import UploadedDocumentsSection from "./UploadedDocumentsSection";

const UserFranchisePipelineTable = () => {
  const [applicants] = useState(initialApplicants);
  const [hasAdminRequest, setHasAdminRequest] = useState(true);

  const userApplication = applicants.slice(0, 1);
  const currentApplicant = userApplication[0];

  return (
    <article className="flex flex-col gap-6">
      {/* Application Progress Stage Overview */}
      <UserPipelineStageOverview currentStage={currentApplicant?.stage} />

      {/* Admin Document Request Status Card (Positioned directly below Application Progress) */}
      <AdminDocumentRequestCard
        hasRequest={hasAdminRequest}
        onRequestToggle={setHasAdminRequest}
      />

      {/* Applicant Scorecard Details */}
      <UserApplicantScorecardSection applicant={currentApplicant} />

      {/* Uploaded Application Documents */}
      <UploadedDocumentsSection showUploadButton={hasAdminRequest} />
    </article>
  );
};

export default UserFranchisePipelineTable;
