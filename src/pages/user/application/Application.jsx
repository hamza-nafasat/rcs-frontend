import PipelineApplicantProgress from "../../../components/global/pipeline/PipelineApplicantProgress";
import UploadedDocumentsSection from "../../../components/global/UploadedDocumentsSection";
import ApplicationScorecardSection from "./components/ApplicationScorecardSection";
import { useGetAllPipelinesQuery } from "../../../store/apis/shared/pipeline.apis";

const Application = () => {
  const { data, isLoading } = useGetAllPipelinesQuery();

  // an applicant owns one application
  const application = data?.data?.[0];

  if (isLoading) return <p className="p-6 text-center text-secondary">Loading your application…</p>;
  if (!application) return <p className="p-6 text-center text-secondary">No application submitted yet.</p>;

  return (
    <article className="flex flex-col gap-6">
      <PipelineApplicantProgress currentStage={application.stage} />

      <ApplicationScorecardSection application={application} />

      <UploadedDocumentsSection showUploadButton />
    </article>
  );
};

export default Application;
