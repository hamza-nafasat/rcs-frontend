import { Briefcase, CalendarDays, DollarSign, Mail, MapPin, Phone, Scale, X } from "lucide-react";
import Avatar from "../../../../components/shared/Avatar";
import Badge from "../../../../components/shared/Badge";
import Loader from "../../../../components/shared/Loader";
import CategoryScores from "../../../../components/global/scorecard/CategoryScores";
import ScoreRadar from "../../../../components/global/scorecard/ScoreRadar";
import ScorecardSection from "../../../../components/global/scorecard/ScorecardSection";
import { buildScorecard, SCORE_CATEGORIES } from "../../../../utils/pipelineScorecard";
import { franchiseStatusOf } from "../../../../utils/franchiseStatus";
import { stageOf } from "../../../../utils/pipelineStage";
import { useGetFranchiseeByIdQuery } from "../../../../store/apis/client/franchisee.apis";
import { formatPhone } from "../../../../utils/formatPhone";

const longDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "—";

const FranchiseeDetailsModal = ({ isOpen, onClose, franchiseeId }) => {
  const { data, isFetching } = useGetFranchiseeByIdQuery(franchiseeId, { skip: !franchiseeId });

  if (!isOpen) return null;
  if (!data?.data) return isFetching ? <Loader className="fixed inset-0 z-50 bg-black/40" /> : null;

  const { franchisee, applications = [] } = data.data;
  const name = `${franchisee?.firstName ?? ""} ${franchisee?.lastName ?? ""}`.trim() || "—";
  const location = [franchisee?.city, franchisee?.state, franchisee?.country].filter(Boolean).join(", ") || "—";
  const status = franchiseStatusOf(franchisee?.franchiseStatus);

  const details = [
    { icon: Mail, label: "Email", value: franchisee?.email },
    { icon: Phone, label: "Phone", value: formatPhone(franchisee?.phone) || "—" },
    { icon: MapPin, label: "Location", value: location },
    { icon: CalendarDays, label: "Applied On", value: longDate(franchisee?.createdAt) },
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
              <p className="mt-0.5 truncate text-sm text-secondary">{franchisee?.email}</p>
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
                <p className="truncate text-sm text-tertiary">{value}</p>
              </div>
            </div>
          ))}
        </section>

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
                    <h3 className="text-base font-semibold text-tertiary">{application?.franchiseName}</h3>
                    <p className="text-xs text-secondary">
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
                  <ScorecardSection icon={DollarSign} title="Financial Profile" items={scorecard.financialProfile} className="md:col-span-3" />
                  <ScorecardSection icon={Briefcase} title="Business Experience" items={scorecard.experience} className="md:col-span-3" />
                  <ScorecardSection icon={Scale} title="Legal & Background" items={scorecard.legal} className="md:col-span-4" />
                  <ScorecardSection icon={MapPin} title="Market & Location Fit" items={scorecard.market} className="md:col-span-2" />
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
