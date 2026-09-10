import { useState } from "react";
import { DollarSign, Briefcase, Scale, MapPin } from "lucide-react";
import ScoreRadar from "../../../../components/global/scorecard/ScoreRadar";
import CategoryScores from "../../../../components/global/scorecard/CategoryScores";
import ScorecardSection from "../../../../components/global/scorecard/ScorecardSection";
import LocationAssignModal from "../../../../components/modals/LocationAssignModal";
import InlineLocationMap from "../../../../components/global/scorecard/InlineLocationMap";
import {
  STAGE_COLORS,
  buildScorecard,
  getRecommendation,
} from "../utils/scorecardData";
import { SCORE_CATEGORIES } from "../utils/scorecardData";

const DashboardApplicantScorecardSection = ({ applicant }) => {
  const [showMapModal, setShowMapModal] = useState(false);

  if (!applicant) return null;

  const stage = applicant.stage;
  const data = buildScorecard(applicant);
  const recommendation = getRecommendation(stage, data.score);

  return (
    <section className="flex flex-col gap-5 rounded-2xl bg-white p-5 sm:p-6 shadow-xs border border-gray-200">
      {/* Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-400">
              {data.id}
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-gray-900">
            {data.name}
          </h2>
          <p className="text-xs text-gray-500">{data.company}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p
              className="text-3xl font-extrabold leading-tight"
              style={{ color: recommendation.color }}
            >
              {data.score.toFixed(1)}
            </p>
            <p className="text-[11px] font-medium text-gray-400">Overall Score / 100</p>
          </div>
        </div>
      </div>

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
      </div>

      {/* Radar Chart & Category Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        <ScoreRadar categories={data.categories} />
        <CategoryScores
            categories={data.categories}
            definitions={SCORE_CATEGORIES}
          />
      </div>

      {/* Detailed Scorecard Breakdown Grid */}
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

      {/* Assigned Branch Location Map Preview */}
      <div className="mt-1">
        <h4 className="text-sm font-bold text-gray-900 mb-2">
          Assigned Location & Territory Map
        </h4>
        <InlineLocationMap
          applicant={applicant}
          onOpenFullMap={() => setShowMapModal(true)}
        />
      </div>

      {/* Full Map Modal */}
      {showMapModal && (
        <LocationAssignModal
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
    </section>
  );
};

export default DashboardApplicantScorecardSection;
