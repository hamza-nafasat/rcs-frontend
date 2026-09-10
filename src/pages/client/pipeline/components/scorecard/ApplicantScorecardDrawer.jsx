import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, DollarSign, Briefcase, Shield, MapPin } from "lucide-react";
import {
  STAGE_COLORS,
  SCORE_CATEGORIES,
  buildScorecard,
  getRecommendation,
} from "../../utils/scorecardData";
import PipelineScoreRadar from "./PipelineScoreRadar";
import PipelineScorecardSection from "./PipelineScorecardSection";
import Badge from "../../../../../components/shared/Badge";
import Button from "../../../../../components/shared/Button";

const CLOSE_DURATION = 250;

const ApplicantScorecardDrawer = ({ isOpen, applicant, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef(null);

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
    const onKeyDown = (event) => event.key === "Escape" && handleClose();

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  if (!isOpen || !applicant) return null;

  const data = buildScorecard(applicant);
  const recommendation = getRecommendation(data.stage, data.score);

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className={`absolute inset-0 bg-black/40 ${isClosing ? "drawer-overlay-closing" : "drawer-overlay"}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <aside
        className={`relative flex h-full w-full max-w-110 flex-col overflow-y-auto bg-muted shadow-xl ${isClosing ? "drawer-panel-closing" : "drawer-panel"}`}
      >
        <article className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b color-border bg-white px-5 py-4">
          <section>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted">{data.id}</span>
              <Badge text={data.stage} dotColor={STAGE_COLORS[data.stage]} />
            </div>
            <h2 className="mt-1 text-xl font-semibold text-tertiary">
              {data.name}
            </h2>
            <p className="text-sm text-secondary">{data.company}</p>
          </section>

          <Button
            type="icon"
            onClick={handleClose}
            aria-label="Close scorecard"
            className="rounded-full! p-1! text-secondary hover:bg-muted"
          >
            <X size={20} />
          </Button>
        </article>

        <article className="flex flex-col gap-4 p-5">
          <section
            className={`rounded-xl border p-4 ${recommendation.bg} ${recommendation.border}`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className={`text-sm font-semibold ${recommendation.text}`}>
                {recommendation.mark ? `${recommendation.mark} ` : ""}
                Recommendation: {recommendation.label}
              </p>

              <div className="text-right">
                <p
                  className="text-2xl font-bold"
                  style={{ color: recommendation.color }}
                >
                  {data.score.toFixed(1)}
                  <span className="ml-1 text-sm font-medium text-secondary">
                    / 100
                  </span>
                </p>
                <p className={`text-[10px] ${recommendation.text}`}>
                  Weighted Total
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SCORE_CATEGORIES.map((category) => (
                <div key={category.key} className="rounded-lg bg-white p-2.5">
                  <p className="text-[10px] text-secondary">
                    {category.shortLabel} ({category.weight}%)
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: category.color }}
                  >
                    {(data.weighted[category.key] ?? 0).toFixed(1)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <PipelineScoreRadar categories={data.categories} />

          <PipelineScorecardSection
            icon={DollarSign}
            iconClassName="text-primary"
            title="Financial Profile"
            items={data.financialProfile}
          />

          <PipelineScorecardSection
            icon={Briefcase}
            iconClassName="text-info"
            title="Business Experience"
            items={data.experience}
          />

          <PipelineScorecardSection
            icon={Shield}
            iconClassName="text-[var(--color-success)]"
            title="Legal & Background"
            items={data.legal}
          />

          <PipelineScorecardSection
            icon={MapPin}
            iconClassName="text-revenue"
            title="Market & Location Fit"
            items={data.market}
          />
        </article>
      </aside>
    </div>,
    document.body,
  );
};

export default ApplicantScorecardDrawer;
