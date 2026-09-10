import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, DollarSign, Briefcase, Scale, MapPin } from "lucide-react";
import Button from "../../../../../components/shared/Button";
import Badge from "../../../../../components/shared/Badge";
import ScoreRadar from "../../../../../components/global/scorecard/ScoreRadar";
import CategoryScores from "../../../../../components/global/scorecard/CategoryScores";
import ScorecardSection from "../../../../../components/global/scorecard/ScorecardSection";
import StageSelector from "../../../../../components/global/scorecard/StageSelector";
import AdminLocationAssignModal from "../../../../../components/modals/LocationAssignModal";
import AdminInlineLocationMap from "../../../../../components/global/scorecard/InlineLocationMap";
import {
  STAGE_COLORS,
  buildScorecard,
  getRecommendation,
} from "../../utils/scorecardData";

const CLOSE_DURATION = 250;

const ApplicantScorecardDrawer = ({
  isOpen,
  applicant,
  onClose,
  onStageChange,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const closeTimer = useRef(null);

  // Play the slide-out animation before unmounting.
  const handleClose = useCallback(() => {
    if (closeTimer.current) return;

    setIsClosing(true);

    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      onClose?.();
    }, CLOSE_DURATION);
  }, [onClose]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (isOpen) setIsClosing(false);
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && handleClose();

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  if (!isOpen || !applicant) return null;

  const stage = applicant.stage;
  const data = buildScorecard(applicant);
  const recommendation = getRecommendation(stage, data.score);

  const handleStageChange = (next) => onStageChange?.(applicant, next);

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className={`absolute inset-0 bg-black/40 ${isClosing ? "drawer-overlay-closing" : "drawer-overlay"}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <aside
        className={`relative flex h-full w-full max-w-110 flex-col overflow-y-auto bg-gray-50 shadow-xl ${isClosing ? "drawer-panel-closing" : "drawer-panel"}`}
      >
        {/* Header */}
        <article className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-gray-200 bg-white px-5 py-4">
          <section>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400">
                {data.id}
              </span>

              <Badge text={stage} dotColor={STAGE_COLORS[stage]} />
            </div>

            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              {data.name}
            </h2>

            <p className="text-sm text-gray-500">{data.company}</p>
          </section>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <Button
              type="icon"
              onClick={handleClose}
              aria-label="Close scorecard"
              className="p-1! text-gray-500 hover:bg-gray-100 rounded-full!"
            >
              <X size={20} />
            </Button>
          </div>
        </article>

        {/* Admin Location Assign Map Modal */}
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

        <article className="flex flex-col gap-4 p-5">
          {/* Recommendation */}
          <section
            className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${recommendation.bg} ${recommendation.border}`}
          >
            <div>
              <p className={`text-sm font-semibold ${recommendation.text}`}>
                {recommendation.code} — {recommendation.label}
              </p>

              <p className="mt-1 text-xs text-gray-600">
                {recommendation.note}
              </p>
            </div>

            <div className="text-right">
              <p
                className="text-2xl font-bold"
                style={{ color: recommendation.color }}
              >
                {data.score.toFixed(1)}
              </p>

              <p className="text-[10px] text-gray-500">/ 100</p>
            </div>
          </section>

          <ScoreRadar categories={data.categories} />

          <CategoryScores categories={data.categories} />

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

          {/* Inline Assigned Branch Location Map Preview */}
          <div className="mt-1">
            <AdminInlineLocationMap
              applicant={applicant}
              onOpenFullMap={() => setShowMapModal(true)}
            />
          </div>

          <StageSelector value={stage} onChange={handleStageChange} />
        </article>
      </aside>
    </div>,
    document.body,
  );
};

export default ApplicantScorecardDrawer;
