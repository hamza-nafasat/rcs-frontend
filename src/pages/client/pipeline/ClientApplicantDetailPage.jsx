import { useState } from "react";
import { useParams } from "react-router-dom";
import { DollarSign, Briefcase, Scale, MapPin } from "lucide-react";
import ClientApplicantStageOverview from "./components/ClientApplicantStageOverview";
import AdminDocumentRequestCard from "../../user/dashboard/components/AdminDocumentRequestCard";
import ScoreRadar from "./components/scorecard/ScoreRadar";
import CategoryScores from "./components/scorecard/CategoryScores";
import ScorecardSection from "./components/scorecard/ScorecardSection";
import AdminLocationAssignModal from "../../admin/pipeline/components/scorecard/AdminLocationAssignModal";
import AdminInlineLocationMap from "../../admin/pipeline/components/scorecard/AdminInlineLocationMap";
import { initialApplicants } from "./data/pipelineApplicants";
import {
  buildScorecard,
  getRecommendation,
} from "./data/scorecardData";

const ClientApplicantDetailPage = () => {
  const { id } = useParams();

  const [applicants] = useState(initialApplicants);
  const [hasAdminRequest, setHasAdminRequest] = useState(true);
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

  return (
    <article className="flex flex-col gap-6 animate-fade-in">
      {/* Application Progress Stage Overview */}
      <ClientApplicantStageOverview currentStage={stage} />



      {/* Main Scorecard Container (Matching User Page Layout) */}
      <div className="flex flex-col gap-5 rounded-2xl bg-white p-5 sm:p-6 shadow-xs border border-gray-200">
        {/* Header & Score Overview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-400">
                {data.id}
              </span>
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl font-bold text-gray-900">
              {data.name}
            </h1>
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
              <p className="text-[11px] font-medium text-gray-400">
                Overall Score / 100
              </p>
            </div>
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

export default ClientApplicantDetailPage;
