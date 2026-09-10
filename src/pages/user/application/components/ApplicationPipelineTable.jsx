import { useState } from "react";
import { initialApplicants } from "../utils/data";
import ApplicationProgress from "./ApplicationProgress";
import ApplicationDocumentRequestCard from "./ApplicationDocumentRequestCard";
import ApplicationScorecardSection from "./ApplicationScorecardSection";
import UploadedDocumentsSection from "../../../../components/global/UploadedDocumentsSection";

const ApplicationPipelineTable = () => {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [hasAdminRequest, setHasAdminRequest] = useState(true);

  const userApplication = applicants.slice(0, 1);
  const currentApplicant = userApplication[0];

  const handleSaveLocation = (updatedAreas) => {
    setApplicants((prev) =>
      prev.map((applicant) =>
        applicant.id === currentApplicant?.id
          ? { ...applicant, territories: updatedAreas }
          : applicant,
      ),
    );
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Application Progress Stage Overview */}
      <ApplicationProgress currentStage={currentApplicant?.stage} />

      {/* Admin Document Request Status Card (Positioned directly below Application Progress) */}
      <ApplicationDocumentRequestCard
        hasRequest={hasAdminRequest}
        onRequestToggle={setHasAdminRequest}
      />

      {/* Applicant Scorecard Details */}
      <ApplicationScorecardSection
        applicant={currentApplicant}
        onSaveLocation={handleSaveLocation}
      />

      {/* Uploaded Application Documents */}
      <UploadedDocumentsSection showUploadButton={hasAdminRequest} />
    </section>
  );
};

export default ApplicationPipelineTable;
