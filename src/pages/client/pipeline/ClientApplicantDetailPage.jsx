import { useState } from "react";
import { useParams } from "react-router-dom";
import { DollarSign, Briefcase, Scale, MapPin } from "lucide-react";
import Badge from "../../../components/shared/Badge";
import ScoreRadar from "./components/scorecard/ScoreRadar";
import ScorecardSection from "./components/scorecard/ScorecardSection";
import { initialApplicants } from "./data/pipelineApplicants";
import {
  STAGE_COLORS,
  buildScorecard,
  getRecommendation,
} from "./data/scorecardData";

const ClientApplicantDetailPage = () => {
  const { id } = useParams();

  const [applicants] = useState(initialApplicants);

  const applicant = applicants.find((a) => String(a.id) === String(id)) || applicants[0];

  if (!applicant) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Applicant not found.</p>
      </div>
    );
  }

  const stage = applicant.stage;
  const data = buildScorecard(applicant);
  const recommendation = getRecommendation(stage, data.score);

  return (
    <article className="flex flex-col gap-6 animate-fade-in">
      {/* Header with Card Background */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-4 sm:p-5 shadow-xs border border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">
              {data.id}
            </span>
            <Badge text={stage} dotColor={STAGE_COLORS[stage] || "var(--color-primary)"} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
            {data.name} — Applicant Scorecard
          </h1>
          <p className="text-xs text-gray-500">{data.company}</p>
        </div>
      </div>

      {/* Main Scorecard Page Container */}
      <div className="flex flex-col gap-5 rounded-2xl bg-white p-5 sm:p-6 shadow-xs border border-gray-200">
        {/* Recommendation Banner */}
        <div
          className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${recommendation.bg} ${recommendation.border}`}
        >
          <div>
            <p className={`text-sm font-bold ${recommendation.text}`}>
              Recommendation: {recommendation.code} — {recommendation.label}
            </p>
            <p className="mt-1 text-xs text-gray-600 font-medium">
              {recommendation.note}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p
              className="text-3xl font-extrabold leading-tight"
              style={{ color: recommendation.color }}
            >
              {data.score.toFixed(1)}
            </p>
            <p className="text-[11px] font-medium text-gray-400">/ 100</p>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <ScoreRadar categories={data.categories} />
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScorecardSection
            icon={DollarSign}
            title="Financial Profile"
            items={data.financialProfile}
            categoryKey="financial"
          />

          <ScorecardSection
            icon={Briefcase}
            title="Business Experience"
            items={data.experience}
            categoryKey="experience"
          />

          <ScorecardSection
            icon={Scale}
            title="Legal & Background"
            items={data.legal}
            categoryKey="legal"
          />

          <ScorecardSection
            icon={MapPin}
            title="Market & Location Fit"
            items={data.market}
            categoryKey="market"
          />
        </div>
      </div>
    </article>
  );
};

export default ClientApplicantDetailPage;
