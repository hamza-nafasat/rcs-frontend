import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Briefcase, CalendarDays, DollarSign, FastForward, FileText, Mail, MapPin, Phone, Scale, Store, X } from "lucide-react";
import Avatar from "../../../../components/shared/Avatar";
import Badge from "../../../../components/shared/Badge";
import Button from "../../../../components/shared/Button";
import Loader from "../../../../components/shared/Loader";
import ProgressBar from "../../../../components/shared/ProgressBar";
import DeleteModal from "../../../../components/modals/DeleteModal";
import CategoryScores from "../../../../components/global/scorecard/CategoryScores";
import ScoreRadar from "../../../../components/global/scorecard/ScoreRadar";
import ScorecardSection from "../../../../components/global/scorecard/ScorecardSection";
import { franchiseeApi, useGetFranchiseeByIdQuery } from "../../../../store/apis/shared/franchisee.apis";
import { useSkipFddFillWaitMutation } from "../../../../store/apis/shared/fdd.apis";
import { buildScorecard, SCORE_CATEGORIES } from "../../../../utils/pipelineScorecard";
import { dayWord, signStatusOf } from "../../../../utils/fddFill";
import { franchiseStatusOf } from "../../../../utils/franchiseStatus";
import { stageOf } from "../../../../utils/pipelineStage";
import { formatPhone } from "../../../../utils/formatPhone";
import { titleCase } from "../../../../utils/titleCase";

const WAITING_DAYS = 14;

const longDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "—";

// the 14 days, as a share already served
const waitProgress = (wait) =>
  wait?.isWaitOver ? 100 : Math.round(((WAITING_DAYS - wait?.daysRemaining) / WAITING_DAYS) * 100);

const FranchiseeDetailsModal = ({ isOpen, onClose, franchiseeId, showClient = false }) => {
  const { data, isFetching } = useGetFranchiseeByIdQuery(franchiseeId, { skip: !franchiseeId });
  const [skipFddFillWait, { isLoading: isSkipping }] = useSkipFddFillWaitMutation();
  const [isConfirmingSkip, setIsConfirmingSkip] = useState(false);
  const dispatch = useDispatch();

  // the row and this modal both read the wait
  const handleSkipWait = async (fillId) => {
    try {
      const response = await skipFddFillWait(fillId).unwrap();
      dispatch(franchiseeApi.util.invalidateTags(["Franchisees", "singleFranchisee"]));
      toast.success(response?.message);
      setIsConfirmingSkip(false);
    } catch (error) {
      console.error("Skip waiting period error:", error);
    }
  };

  if (!isOpen) return null;
  if (!data?.data) return isFetching ? <Loader className="fixed inset-0 z-50 bg-black/40" /> : null;

  const { franchisee, applications = [] } = data.data;
  const name = `${franchisee?.firstName ?? ""} ${franchisee?.lastName ?? ""}`.trim() || "—";
  const location = [franchisee?.city, franchisee?.state, franchisee?.country].filter(Boolean).join(", ") || "—";
  const status = franchiseStatusOf(franchisee?.franchiseStatus);
  const wait = franchisee?.fddWait;
  const fdd = signStatusOf(wait);

  const details = [
    { icon: Mail, label: "Email", value: franchisee?.email },
    { icon: Phone, label: "Phone", value: formatPhone(franchisee?.phone) || "—" },
    { icon: MapPin, label: "Location", value: location },
    { icon: CalendarDays, label: "Applied On", value: longDate(franchisee?.createdAt) },
    ...(showClient ? [{ icon: Store, label: "Client", value: franchisee?.clientName ?? "—" }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* Heading */}
        <header className="mb-6 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={name} />

            <div className="min-w-0">
              <h2 className="heading-lg text-tertiary">{name}</h2>
              <p className="mt-0.5 wrap-break-word text-sm text-secondary">{franchisee?.email}</p>
              <span className="mt-2 inline-block">
                <Badge text={status.label} dotColor={status.color} />
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1 text-muted transition hover:bg-active"
          >
            <X size={20} />
          </button>
        </header>

        {/* Contact */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl bg-active p-3">
              <Icon size={16} className="shrink-0 text-muted" />
              <div className="min-w-0">
                <p className="text-[11px] tracking-wide text-secondary uppercase">{label}</p>
                <p className="wrap-break-word text-sm text-tertiary">{value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* FDD progress */}
        <section className="mt-6 rounded-2xl border color-border p-5">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-base font-semibold text-tertiary">
              <FileText size={16} className="text-muted" />
              FDD
            </h3>

            <Badge text={fdd.label} dotColor={fdd.color} />
          </header>

          {!wait ? (
            <p className="mt-3 text-sm text-muted">This applicant has not signed a Franchise Disclosure Document yet.</p>
          ) : (
            <>
              <p className="mt-3 wrap-break-word text-sm text-secondary">
                {wait?.fddName ?? "Document"}
                {wait?.state ? ` · ${titleCase(wait?.state)}` : ""} · signed {longDate(wait?.filledAt)}
              </p>

              {/* the countdown goes once it is served */}
              {!wait?.isWaitOver && (
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                    <span className="text-secondary">Waiting period</span>
                    <span className="font-medium text-tertiary">{dayWord(wait?.daysRemaining)} left</span>
                  </div>

                  <ProgressBar value={waitProgress(wait)} color={fdd.color} />

                  <p className="mt-1.5 text-xs text-muted">Opens on {longDate(wait?.completesAt)}</p>
                </div>
              )}

              {/* TODO: drop this development shortcut */}
              {!wait?.isWaitOver && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="bare"
                    onClick={() => setIsConfirmingSkip(true)}
                    icon={<FastForward size={14} />}
                    className="rounded-xl border border-dashed border-(--color-text-moderator) bg-moderator px-3! py-2! text-xs font-medium text-moderator transition hover:brightness-95"
                  >
                    Skip the wait (dev only)
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        {/* TODO: drop this development shortcut */}
        <DeleteModal
          isOpen={isConfirmingSkip}
          onClose={() => setIsConfirmingSkip(false)}
          onConfirm={() => handleSkipWait(wait?._id)}
          isLoading={isSkipping}
          icon={<FastForward size={26} />}
          heading="Skip the waiting period"
          text={`End the 14 day wait for ${name} right now? The signed FDD moves to Pending so you can approve or reject it. This shortcut exists for testing only.`}
          confirmText="Skip the wait"
        />

        {/* Applications */}
        {applications.length === 0 ? (
          <p className="mt-6 rounded-xl bg-active p-4 text-sm text-muted">No applications yet</p>
        ) : (
          applications.map((application) => {
            const scorecard = buildScorecard(application);
            const stage = stageOf(application?.stage);

            return (
              <section key={application._id} className="mt-6 flex flex-col gap-5 rounded-2xl border color-border p-5">
                <header className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="wrap-break-word text-base font-semibold text-tertiary">
                      {application?.franchiseName}
                    </h3>
                    <p className="wrap-break-word text-xs text-secondary">
                      {application?.proposedTerritory || "No proposed territory"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge text={stage.label} dotColor={stage.color} />
                    <p className="text-2xl font-bold text-tertiary">{scorecard.score.toFixed(1)}</p>
                  </div>
                </header>

                <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2">
                  <ScoreRadar categories={scorecard.categories} />
                  <CategoryScores categories={scorecard.categories} definitions={SCORE_CATEGORIES} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                  <ScorecardSection
                    icon={DollarSign}
                    title="Financial Profile"
                    items={scorecard.financialProfile}
                    className="md:col-span-3"
                  />
                  <ScorecardSection
                    icon={Briefcase}
                    title="Business Experience"
                    items={scorecard.experience}
                    className="md:col-span-3"
                  />
                  <ScorecardSection
                    icon={Scale}
                    title="Legal & Background"
                    items={scorecard.legal}
                    className="md:col-span-4"
                  />
                  <ScorecardSection
                    icon={MapPin}
                    title="Market & Location Fit"
                    items={scorecard.market}
                    className="md:col-span-2"
                  />
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FranchiseeDetailsModal;
