import { Building2, Globe, Mail, Map, Phone } from "lucide-react";
import { formatPhone } from "../../../utils/formatPhone";

const plain = (value) => (value == null || value === "" ? "—" : String(value));

const PipelineApplicantContact = ({ applicant, className = "" }) => {
  // what the intake saved about them
  const details = [
    { icon: Mail, label: "Email", value: plain(applicant?.email) },
    { icon: Phone, label: "Phone", value: formatPhone(applicant?.phone) || "—" },
    { icon: Building2, label: "City", value: plain(applicant?.city) },
    { icon: Map, label: "State", value: plain(applicant?.state) },
    { icon: Globe, label: "Country", value: plain(applicant?.country) },
  ];

  return (
    <section className={className}>
      <h3 className="mb-3 text-sm font-semibold text-tertiary">Applicant Details</h3>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border color-border bg-gray-50">
              <Icon size={16} className="text-secondary" />
            </div>

            <div className="min-w-0">
              <dt className="text-xs text-secondary">{label}</dt>
              <dd className="wrap-break-word text-sm text-tertiary">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default PipelineApplicantContact;
