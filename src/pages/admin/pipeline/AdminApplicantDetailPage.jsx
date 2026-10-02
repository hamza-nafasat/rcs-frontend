import { useState } from "react";
import { useParams } from "react-router-dom";
import { DollarSign, Briefcase, Scale, MapPin, ArrowRight } from "lucide-react";
import ScoreRadar from "../../../components/global/scorecard/ScoreRadar";
import CategoryScores from "../../../components/global/scorecard/CategoryScores";
import ScorecardSection from "../../../components/global/scorecard/ScorecardSection";
import StageSelector from "../../../components/global/scorecard/StageSelector";
import PipelineApplicantProgress from "../../../components/global/pipeline/PipelineApplicantProgress";
import MapLocationAssign from "../../../components/global/map/MapLocationAssign";
import PipelineRequestTable from "../../../components/global/pipeline/PipelineRequestTable";
import PipelineRequestModal from "../../../components/global/pipeline/PipelineRequestModal";
import MakeRequestModal from "../../../components/modals/MakeRequestModal";
import DeleteModal from "../../../components/modals/DeleteModal";
import { buildScorecard, getRecommendation, SCORE_CATEGORIES } from "../../../utils/pipelineScorecard";
import {
  useAssignPipelineLocationMutation,
  useCreatePipelineRequestMutation,
  useDeletePipelineRequestMutation,
  useGetPipelineByIdQuery,
  useGetPipelineRequestsQuery,
  useUpdatePipelineRequestMutation,
  useUpdatePipelineStageMutation,
} from "../../../store/apis/shared/pipeline.apis";
import { useGetAllClientsQuery, useGetClientByIdQuery } from "../../../store/apis/admin/client.apis";
import { PIPELINE_STAGES, stageOf } from "../../../utils/pipelineStage";
import { withMapId } from "../../../utils/mapHelpers";
import { firstNewFranchise, toRequestFormData } from "../../../utils/pipelineRequest";

const AdminApplicantDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetPipelineByIdQuery(id);
  const { data: requestsData, isFetching: isLoadingRequests } = useGetPipelineRequestsQuery(id, { skip: !id });

  const [updatePipelineStage, { isLoading: isUpdating }] = useUpdatePipelineStageMutation();
  const [createPipelineRequest] = useCreatePipelineRequestMutation();
  const [updatePipelineRequest] = useUpdatePipelineRequestMutation();
  const [deletePipelineRequest] = useDeletePipelineRequestMutation();
  const [assignPipelineLocation] = useAssignPipelineLocationMutation();

  const application = data?.data;

  // pipeline client is an account
  const clientAccountId = application?.client?._id;
  const { data: clientsData } = useGetAllClientsQuery(undefined, { skip: !clientAccountId });
  const restaurantId = clientsData?.data?.find((client) => client?.account?._id === clientAccountId)?._id;
  const { data: clientData } = useGetClientByIdQuery(restaurantId, { skip: !restaurantId });

  const [mapData, setMapData] = useState(null);
  const [requestToView, setRequestToView] = useState(null);
  const [requestToEdit, setRequestToEdit] = useState(null);
  const [pendingStage, setPendingStage] = useState(null);

  if (isLoading) return <p className="p-6 text-center text-secondary">Loading application…</p>;
  if (!application) return <p className="p-6 text-center text-secondary">Application not found.</p>;

  const requests = requestsData?.data ?? [];
  const isAssigningLocation = application.stage === PIPELINE_STAGES.ASSIGN_LOCATION;
  const franchises = mapData?.franchises ?? withMapId(clientData?.data?.franchises ?? []);
  const areas = mapData?.areas ?? withMapId(clientData?.data?.territories ?? []);

  const scorecard = buildScorecard(application);
  const recommendation = getRecommendation(application.stage, scorecard.score);

  // the stage moves only once confirmed
  const handleStageChange = async () => {
    try {
      await updatePipelineStage({ id, stage: pendingStage }).unwrap();
    } catch {
      // the toast already reported it
    }
    setPendingStage(null);
  };

  // the backend approves the applicant
  const handleAssignLocation = async (records) => {
    setMapData(records);
    const franchise = firstNewFranchise(records?.franchises);
    if (!franchise) return;

    try {
      await assignPipelineLocation({
        id,
        franchise: {
          name: franchise.name,
          country: franchise.country,
          state: franchise.state,
          city: franchise.city,
          lat: franchise.lat,
          lng: franchise.lng,
        },
      }).unwrap();
    } catch {
      // the toast already reported it
    }
  };

  // the modal stays open on failure
  const handleSendRequest = (form) => createPipelineRequest({ id, body: toRequestFormData(form) }).unwrap();

  const handleEditRequest = (form) =>
    updatePipelineRequest({ id, requestId: requestToEdit?._id, body: toRequestFormData(form) }).unwrap();

  const handleDeleteRequest = async (request) => {
    try {
      await deletePipelineRequest({ id, requestId: request?._id }).unwrap();
    } catch {
      // the toast already reported it
    }
  };

  return (
    <article className="flex flex-col gap-6">
      <PipelineApplicantProgress currentStage={application.stage} canRequest onMakeRequestSubmit={handleSendRequest} />

      <section className="flex flex-col gap-5 rounded-2xl border color-border bg-white p-5 shadow-xs sm:p-6">
        {/* Applicant */}
        <header>
          <h1 className="heading-xl text-tertiary">{scorecard.name}</h1>
          <p className="text-xs text-secondary">{scorecard.company}</p>
        </header>

        {/* Recommendation */}
        <div className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${recommendation.bg} ${recommendation.border}`}>
          <div className="min-w-0">
            <p className={`text-sm font-bold ${recommendation.text}`}>
              Recommendation: {recommendation.label}
            </p>
            <p className="mt-1 text-xs font-medium text-secondary">{recommendation.note}</p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-3xl leading-tight font-extrabold" style={{ color: recommendation.color }}>
              {scorecard.score.toFixed(1)}
            </p>
            <p className="text-[11px] font-medium text-muted">/ 100</p>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2">
          <ScoreRadar categories={scorecard.categories} />
          <CategoryScores categories={scorecard.categories} definitions={SCORE_CATEGORIES} />
        </div>

        {/* Answers */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
          <ScorecardSection icon={DollarSign} title="Financial Profile" items={scorecard.financialProfile} className="md:col-span-3" />
          <ScorecardSection icon={Briefcase} title="Business Experience" items={scorecard.experience} className="md:col-span-3" />
          <ScorecardSection icon={Scale} title="Legal & Background" items={scorecard.legal} className="md:col-span-4" />
          <ScorecardSection icon={MapPin} title="Market & Location Fit" items={scorecard.market} className="md:col-span-2" />
        </div>

        {/* Stage update */}
        <footer className="mt-4 border-t color-border pt-4">
          <StageSelector value={application.stage} onChange={setPendingStage} disabled={isUpdating} />
        </footer>
      </section>

      {/* Only at the assign location stage */}
      {isAssigningLocation && (
        <section className="flex flex-col gap-4 rounded-2xl border color-border bg-white p-5">
          <header>
            <h2 className="heading-lg text-tertiary">Assign Location</h2>
            <p className="text-xs text-secondary">
              Add a franchise location for this applicant. Existing areas cannot be redrawn.
            </p>
          </header>

          <MapLocationAssign
            franchises={franchises}
            areas={areas}
            canEdit
            canDrawArea={false}
            canEditSavedFranchises={false}
            requireNewFranchise
            onChange={handleAssignLocation}
          />
        </section>
      )}

      {/* Requests sent to the applicant */}
      <PipelineRequestTable
        requests={requests}
        isLoading={isLoadingRequests}
        onView={setRequestToView}
        onEdit={setRequestToEdit}
        onDelete={handleDeleteRequest}
      />

      <PipelineRequestModal
        isOpen={Boolean(requestToView)}
        onClose={() => setRequestToView(null)}
        request={requestToView}
      />

      {/* a stage change is confirmed first */}
      <DeleteModal
        isOpen={Boolean(pendingStage)}
        onClose={() => setPendingStage(null)}
        onConfirm={handleStageChange}
        isLoading={isUpdating}
        icon={<ArrowRight size={26} />}
        heading="Update Application Stage"
        text={`Move this application to ${stageOf(pendingStage).label}? The applicant sees this change.`}
        confirmText="Update Stage"
      />

      {/* the key reloads the edit fields */}
      <MakeRequestModal
        key={requestToEdit?._id}
        isOpen={Boolean(requestToEdit)}
        onClose={() => setRequestToEdit(null)}
        onSubmit={handleEditRequest}
        mode="edit"
        initialData={requestToEdit}
      />
    </article>
  );
};

export default AdminApplicantDetailPage;
