import { useState } from "react";
import PipelineApplicantProgress from "../../../components/global/pipeline/PipelineApplicantProgress";
import PipelineRequestTable from "../../../components/global/pipeline/PipelineRequestTable";
import PipelineRequestModal from "../../../components/global/pipeline/PipelineRequestModal";
import PipelineRequestFillModal from "../../../components/global/pipeline/PipelineRequestFillModal";
import ApplicationScorecardSection from "./components/ApplicationScorecardSection";
import { useGetAllPipelinesQuery } from "../../../store/apis/shared/pipeline.apis";
import { REQUEST_STATUSES } from "../../../utils/requestStatus";
import { toFileRecords } from "../../../utils/fileRecords";
import { initialRequests } from "./utils/data";

const Application = () => {
  const { data, isLoading } = useGetAllPipelinesQuery();

  // TODO: move to requests api
  const [requests, setRequests] = useState(initialRequests);
  const [viewId, setViewId] = useState(null);
  const [fillId, setFillId] = useState(null);

  // an applicant owns one application
  const application = data?.data?.[0];

  // the open rows follow the list
  const requestToView = requests.find((request) => request._id === viewId) ?? null;
  const requestToFill = requests.find((request) => request._id === fillId) ?? null;

  if (isLoading) return <p className="p-6 text-center text-secondary">Loading your application…</p>;
  if (!application) return <p className="p-6 text-center text-secondary">No application submitted yet.</p>;

  const handleFillRequest = ({ message, files }) => {
    setRequests((prev) =>
      prev.map((item) =>
        item._id === fillId
          ? {
              ...item,
              status: REQUEST_STATUSES.FILLED,
              response: { message, files: toFileRecords(files), submittedAt: new Date().toISOString() },
            }
          : item,
      ),
    );
    setFillId(null);
  };

  return (
    <article className="flex flex-col gap-6">
      <PipelineApplicantProgress currentStage={application.stage} />

      <ApplicationScorecardSection application={application} />

      {/* Requests the admin sent */}
      <PipelineRequestTable
        requests={requests}
        heading="Document Requests"
        subheading="Documents the admin asked you to provide"
        emptyText="No requests from the admin yet"
        onView={(request) => setViewId(request._id)}
      />

      <PipelineRequestModal
        isOpen={Boolean(requestToView)}
        onClose={() => setViewId(null)}
        request={requestToView}
        canFill
        onFill={() => setFillId(viewId)}
      />

      <PipelineRequestFillModal
        isOpen={Boolean(requestToFill)}
        onClose={() => setFillId(null)}
        onSubmit={handleFillRequest}
        request={requestToFill}
      />
    </article>
  );
};

export default Application;
