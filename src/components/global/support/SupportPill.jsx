const SupportPill = ({ label, pill, dot }) => (
  <span
    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${pill}`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
    {label}
  </span>
);

export default SupportPill;
