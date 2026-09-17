const money = (value) => (value == null ? "—" : `$${Number(value).toLocaleString()}`);

const yesNo = (value) => ({ Y: "Yes", N: "No" })[value] ?? "—";

const plain = (value) => (value == null || value === "" ? "—" : String(value));

const words = (value) => (value ? String(value).replace(/_/g, " ") : "—");

const DETAIL_SECTIONS = [
  {
    heading: "Financial Strength",
    fields: [
      { label: "Liquid Capital", key: "liquidCapital", format: money },
      { label: "Net Worth", key: "netWorth", format: money },
      { label: "Credit Score", key: "creditScore", format: plain },
    ],
  },
  {
    heading: "Business Experience",
    fields: [
      { label: "Years Managing", key: "yearsMgmt", format: plain },
      { label: "Food Experience", key: "foodExp", format: yesNo },
      { label: "Multi-Unit Operator", key: "multiUnit", format: yesNo },
    ],
  },
  {
    heading: "Legal & Background",
    fields: [
      { label: "Bankruptcy", key: "bankruptcy", format: yesNo },
      { label: "Pending Litigation", key: "litigation", format: yesNo },
      { label: "Criminal Record", key: "criminal", format: yesNo },
      { label: "Non-Compete Conflict", key: "nonCompete", format: yesNo },
    ],
  },
  {
    heading: "Market & Location Fit",
    fields: [
      { label: "Territory Available", key: "territoryAvailable", format: yesNo },
      { label: "Competitive Density", key: "density", format: words },
    ],
  },
];

const SCORE_FIELDS = [
  { label: "Financial", key: "financial" },
  { label: "Experience", key: "experience" },
  { label: "Legal", key: "legal" },
  { label: "Market", key: "market" },
];

const ClientDetailSummary = ({ client }) => (
  <>
    {/* Application Score */}
    <section className="rounded-xl border color-border bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-tertiary">Application Score</h3>
        <span className="text-lg font-bold text-primary">
          {client?.scores?.total == null ? "—" : client.scores.total.toFixed(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SCORE_FIELDS.map(({ label, key }) => (
          <div key={key} className="rounded-lg border color-border bg-white px-3 py-2 text-center">
            <p className="text-[10px] font-semibold uppercase text-secondary">{label}</p>
            <p className="mt-0.5 text-sm font-bold text-tertiary">
              {client?.scores?.[key] == null ? "—" : client.scores[key].toFixed(1)}
            </p>
          </div>
        ))}
      </div>
    </section>

    {DETAIL_SECTIONS.map(({ heading, fields }) => (
      <section key={heading}>
        <h3 className="mb-3 text-sm font-semibold text-tertiary">{heading}</h3>

        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {fields.map(({ label, key, format }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-lg border color-border bg-white px-3 py-2"
            >
              <dt className="min-w-0 truncate text-xs text-secondary">{label}</dt>
              <dd className="shrink-0 text-sm font-medium capitalize text-tertiary">{format(client?.[key])}</dd>
            </div>
          ))}
        </dl>
      </section>
    ))}
  </>
);

export default ClientDetailSummary;
