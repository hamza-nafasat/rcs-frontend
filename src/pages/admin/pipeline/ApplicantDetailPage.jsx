import { useState } from "react";
import { useParams } from "react-router-dom";
import { DollarSign, Briefcase, Scale, MapPin } from "lucide-react";
import Button from "../../../components/shared/Button";
import Badge from "../../../components/shared/Badge";
import ScoreRadar from "./components/scorecard/ScoreRadar";
import CategoryScores from "./components/scorecard/CategoryScores";
import ScorecardSection from "./components/scorecard/ScorecardSection";
import StageSelector from "./components/scorecard/StageSelector";
import AdminLocationAssignModal from "./components/scorecard/AdminLocationAssignModal";
import AdminInlineLocationMap from "./components/scorecard/AdminInlineLocationMap";
import { initialApplicants } from "./components/pipelineApplicants";
import {
  STAGE_COLORS,
  buildScorecard,
  getRecommendation,
} from "./components/scorecard/scorecardData";

const ApplicantDetailPage = () => {
  const { id } = useParams();

  const [applicants, setApplicants] = useState(initialApplicants);
  const [showMapModal, setShowMapModal] = useState(false);

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

  const handleStageChange = (nextStage) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === applicant.id ? { ...a, stage: nextStage } : a))
    );
    applicant.stage = nextStage;
  };

  return (
    <article className="flex flex-col gap-6 animate-fade-in">
      {/* Header with Card Background */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-4 sm:p-5 shadow-xs border border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">
              {data.id}
            </span>
            <Badge text={stage} dotColor={STAGE_COLORS[stage] || "#2563eb"} />
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

        {/* Radar Chart & Category Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <ScoreRadar categories={data.categories} />
          <CategoryScores categories={data.categories} />
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScorecardSection
            icon={DollarSign}
            title="Financial Profile"
            items={data.financialProfile}
          />

          <ScorecardSection
            icon={Briefcase}
            title="Business Experience"
            items={data.experience}
          />

          <ScorecardSection
            icon={Scale}
            title="Legal & Background"
            items={data.legal}
          />

          <ScorecardSection
            icon={MapPin}
            title="Market & Location Fit"
            items={data.market}
          />
        </div>

        {/* Location Map Preview */}
        <div className="mt-1">
          <h4 className="text-sm font-bold text-gray-900 mb-2">
            Assigned Territory & Location Map
          </h4>
          <AdminInlineLocationMap
            applicant={applicant}
            onOpenFullMap={() => setShowMapModal(true)}
          />
        </div>

        {/* Application Stage Selector */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-bold text-gray-900 mb-2">
            Update Application Stage
          </h4>
          <StageSelector value={stage} onChange={handleStageChange} />
        </div>
      </div>

      {/* Full Map Modal */}
      {showMapModal && (
        <AdminLocationAssignModal
          isOpen={showMapModal}
          applicant={applicant}
          onClose={() => setShowMapModal(false)}
          onSaveLocation={(updatedAreas) => {
            if (applicant) {
              applicant.territories = updatedAreas;
            }
          }}
        />
      )}
    </article>
  );
};

export default ApplicantDetailPage;
