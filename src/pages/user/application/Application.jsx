import { useState } from "react";
import PipelineApplicantProgress from "../../../components/global/pipeline/PipelineApplicantProgress";
import PipelineRequestTable from "../../../components/global/pipeline/PipelineRequestTable";
import PipelineRequestModal from "../../../components/global/pipeline/PipelineRequestModal";
import PipelineRequestFillModal from "../../../components/global/pipeline/PipelineRequestFillModal";
import ApplicationScorecardSection from "./components/ApplicationScorecardSection";
import { toResponseFormData } from "../../../utils/pipelineRequest";
import {
  useGetAllPipelinesQuery,
  useGetPipelineRequestsQuery,
  useRespondToPipelineRequestMutation,
} from "../../../store/apis/shared/pipeline.apis";

const Application = () => {
  const { data, isLoading } = useGetAllPipelinesQuery();

  // an applicant owns one application
  const application = data?.data?.[0];

  const { data: requestsData, isFetching: isLoadingRequests } = useGetPipelineRequestsQuery(application?._id, {
    skip: !application?._id,
  });
  const [respondToPipelineRequest] = useRespondToPipelineRequestMutation();

  const [viewId, setViewId] = useState(null);
  const [fillId, setFillId] = useState(null);

  if (isLoading) return <p className="p-6 text-center text-secondary">Loading your application…</p>;
  if (!application) return <p className="p-6 text-center text-secondary">No application submitted yet.</p>;

  const requests = requestsData?.data ?? [];

  // the open rows follow the list
  const requestToView = requests.find((request) => request._id === viewId) ?? null;
  const requestToFill = requests.find((request) => request._id === fillId) ?? null;

  // the modal stays open on failure
  const handleFillRequest = (form) =>
    respondToPipelineRequest({ id: application._id, requestId: fillId, body: toResponseFormData(form) }).unwrap();

  return (
    <article className="flex flex-col gap-6">
      <PipelineApplicantProgress currentStage={application.stage} />

      <ApplicationScorecardSection application={application} />

      {/* Requests the admin sent */}
      <PipelineRequestTable
        requests={requests}
        isLoading={isLoadingRequests}
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
