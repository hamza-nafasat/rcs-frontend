import { MapPin } from "lucide-react";
import Avatar from "../../../../components/shared/Avatar";
import ProgressBar from "../../../../components/shared/ProgressBar";
import { useState } from "react";
import { initialApplicants } from "../../../admin/pipeline/components/pipelineApplicants";
import UserPipelineStageOverview from "./UserPipelineStageOverview";
import UserApplicantScorecardSection from "./UserApplicantScorecardSection";
import UploadedDocumentsSection from "./UploadedDocumentsSection";

const scoreColor = (score) => {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f97316";
  return "#dc2626";
};

const UserFranchisePipelineTable = () => {
  const [applicants] = useState(initialApplicants);

  const userApplication = applicants.slice(0, 1);
  const currentApplicant = userApplication[0];

  return (
    <article className="flex flex-col gap-6">
      {/* Application Progress Stage Overview (Moved Down) */}
      <UserPipelineStageOverview currentStage={currentApplicant?.stage} />

      {/* Applicant Scorecard Details at Top */}
      <UserApplicantScorecardSection applicant={currentApplicant} />

      {/* Uploaded Application Documents */}
      <UploadedDocumentsSection />
    </article>
  );
};

export default UserFranchisePipelineTable;
