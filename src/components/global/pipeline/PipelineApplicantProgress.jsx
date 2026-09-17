import { useState } from "react";
import { CheckCircle2, Circle, MessageSquarePlus } from "lucide-react";
import Button from "../../shared/Button";
import MakeRequestModal from "../../modals/MakeRequestModal";
import { PIPELINE_STAGE, PIPELINE_STAGES } from "../../../utils/pipelineStage";

// a denied application leaves the track
const TRACK_STAGES = Object.entries(PIPELINE_STAGE).filter(([stage]) => stage !== PIPELINE_STAGES.DENIED);

const PipelineApplicantProgress = ({ currentStage, canRequest = false, onMakeRequestSubmit, className = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeIndex = TRACK_STAGES.findIndex(([stage]) => stage === currentStage);
  const currentIndex = activeIndex === -1 ? 0 : activeIndex;

  const handleRequestSubmit = (requestData) => {
    onMakeRequestSubmit?.(requestData);
    setIsModalOpen(false);
  };

  return (
    <section className={`flex flex-col gap-4 rounded-2xl border color-border bg-white p-4 shadow-sm sm:p-5 ${className}`}>
      <div className="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
        <div>
          <h2 className="heading-lg text-tertiary">Application Progress</h2>
          <p className="mt-0.5 text-xs text-secondary">Track this applicant's pipeline stage progress</p>
        </div>

        {/* Admin only request action */}
        {canRequest && (
          <Button
            type="button"
            icon={<MessageSquarePlus size={16} />}
            onClick={() => setIsModalOpen(true)}
            className="self-start px-4! py-2! text-xs font-semibold text-white sm:self-auto"
          >
            Make a Request
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7">
        {TRACK_STAGES.map(([stage, { label, color, bg }], index) => {
          if (index === currentIndex) {
            return (
              <div
                key={stage}
                style={{ backgroundColor: bg, borderColor: color }}
                className="flex min-h-23 w-full flex-col items-center justify-between rounded-xl border-2 p-3 text-center shadow-sm"
              >
                <span
                  className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-2xs"
                  style={{ color }}
                >
                  Active
                </span>
                <p className="flex-1 py-1 text-xs leading-tight font-bold" style={{ color }}>
                  {label}
                </p>
              </div>
            );
          }

          if (index < currentIndex) {
            return (
              <div
                key={stage}
                className="flex min-h-23 w-full flex-col items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-center"
              >
                <CheckCircle2 size={18} className="text-emerald-600" />
                <p className="flex-1 py-1 text-xs leading-tight font-semibold text-emerald-900">{label}</p>
              </div>
            );
          }

          return (
            <div
              key={stage}
              className="flex min-h-23 w-full flex-col items-center justify-between rounded-xl border color-border bg-muted p-3 text-center opacity-70"
            >
              <Circle size={15} className="text-muted" />
              <p className="flex-1 py-1 text-xs leading-tight font-medium text-muted">{label}</p>
            </div>
          );
        })}
      </div>

      {/* Request documents from applicant */}
      {canRequest && (
        <MakeRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleRequestSubmit} />
      )}
    </section>
  );
};

export default PipelineApplicantProgress;
