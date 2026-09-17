import { useParams } from "react-router-dom";
import { DollarSign, Briefcase, Scale, MapPin } from "lucide-react";
import ScoreRadar from "../../../components/global/scorecard/ScoreRadar";
import CategoryScores from "../../../components/global/scorecard/CategoryScores";
import ScorecardSection from "../../../components/global/scorecard/ScorecardSection";
import PipelineApplicantProgress from "../../../components/global/pipeline/PipelineApplicantProgress";
import { buildScorecard, getRecommendation, SCORE_CATEGORIES } from "../../../utils/pipelineScorecard";
import { useGetPipelineByIdQuery } from "../../../store/apis/shared/pipeline.apis";

const ClientApplicantDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetPipelineByIdQuery(id);

  const application = data?.data;

  if (isLoading) return <p className="p-6 text-center text-secondary">Loading application…</p>;
  if (!application) return <p className="p-6 text-center text-secondary">Application not found.</p>;

  const scorecard = buildScorecard(application);
  const recommendation = getRecommendation(application.stage, scorecard.score);

  return (
    <article className="flex flex-col gap-6">
      <PipelineApplicantProgress currentStage={application.stage} />

      <section className="flex flex-col gap-5 rounded-2xl border color-border bg-white p-5 shadow-xs sm:p-6">
        {/* Applicant */}
        <header className="flex flex-col justify-between gap-4 border-b color-border pb-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h1 className="heading-xl text-tertiary">{scorecard.name}</h1>
            <p className="text-xs text-secondary">{scorecard.company}</p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-3xl leading-tight font-extrabold" style={{ color: recommendation.color }}>
              {scorecard.score.toFixed(1)}
            </p>
            <p className="text-[11px] font-medium text-muted">Overall Score / 100</p>
          </div>
        </header>

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
      </section>
    </article>
  );
};

export default ClientApplicantDetailPage;
