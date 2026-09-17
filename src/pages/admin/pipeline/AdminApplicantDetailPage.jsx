import { useParams } from "react-router-dom";
import { DollarSign, Briefcase, Scale, MapPin } from "lucide-react";
import ScoreRadar from "../../../components/global/scorecard/ScoreRadar";
import CategoryScores from "../../../components/global/scorecard/CategoryScores";
import ScorecardSection from "../../../components/global/scorecard/ScorecardSection";
import StageSelector from "../../../components/global/scorecard/StageSelector";
import PipelineApplicantProgress from "../../../components/global/pipeline/PipelineApplicantProgress";
import UploadedDocumentsSection from "../../../components/global/UploadedDocumentsSection";
import { buildScorecard, getRecommendation, SCORE_CATEGORIES } from "../../../utils/pipelineScorecard";
import { useGetPipelineByIdQuery, useUpdatePipelineStageMutation } from "../../../store/apis/shared/pipeline.apis";

const AdminApplicantDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetPipelineByIdQuery(id);
  const [updatePipelineStage, { isLoading: isUpdating }] = useUpdatePipelineStageMutation();

  const application = data?.data;

  if (isLoading) return <p className="p-6 text-center text-secondary">Loading application…</p>;
  if (!application) return <p className="p-6 text-center text-secondary">Application not found.</p>;

  const scorecard = buildScorecard(application);
  const recommendation = getRecommendation(application.stage, scorecard.score);

  const handleStageChange = async (stage) => {
    try {
      await updatePipelineStage({ id, stage }).unwrap();
    } catch {
      // the toast already reported it
    }
  };

  return (
    <article className="flex flex-col gap-6">
      <PipelineApplicantProgress currentStage={application.stage} canRequest />

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
              Recommendation: {recommendation.code} — {recommendation.label}
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ScorecardSection icon={DollarSign} title="Financial Profile" items={scorecard.financialProfile} />
          <ScorecardSection icon={Briefcase} title="Business Experience" items={scorecard.experience} />
          <ScorecardSection icon={Scale} title="Legal & Background" items={scorecard.legal} />
          <ScorecardSection icon={MapPin} title="Market & Location Fit" items={scorecard.market} />
        </div>

        {/* Stage update */}
        <footer className="mt-4 border-t color-border pt-4">
          <StageSelector value={application.stage} onChange={handleStageChange} disabled={isUpdating} />
        </footer>
      </section>

      <UploadedDocumentsSection showUploadButton={false} />
    </article>
  );
};

export default AdminApplicantDetailPage;
