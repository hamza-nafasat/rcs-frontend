import DashboardHeading from "./DashboardHeading";
import Button from "../../../../components/shared/Button";

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  "Needs Attention": "bg-amber-100 text-amber-700",
  Inactive: "bg-gray-100 text-gray-600",
};

const StatusPill = ({ status }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
      statusStyles[status] ?? statusStyles.Inactive
    }`}
  >
    {status}
  </span>
);

const DashboardLeadsPerClient = ({
  clients = [],
  heading = "Leads per Client",
  subheading = `${clients.length} active Clients`,
  onViewAll,
}) => {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <DashboardHeading heading={heading} subheading={subheading} />

        {onViewAll && (
          <Button
            className="shrink-0 !py-2 px-4 text-sm font-medium"
            onClick={onViewAll}
          >
            View All
          </Button>
        )}
      </div>

      {/* Table view (sm and up) */}
      <div className="hidden min-h-0 min-w-0 flex-1 overflow-auto sm:block">
        <table className="w-full min-w-[420px] border-collapse">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-gray-200 bg-white">
              <th className="py-3 pr-4 text-left text-sm font-medium text-gray-500">
                Restaurant
              </th>
              <th className="py-3 pr-4 text-left text-sm font-medium text-gray-500">
                Owner
              </th>
              <th className="py-3 pr-4 text-left text-sm font-medium text-gray-500">
                Leads
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client, index) => (
              <tr
                key={client.id ?? index}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="py-3 pr-4 text-sm font-medium text-gray-900">
                  {client.name}
                </td>
                <td className="py-3 pr-4 text-sm text-gray-700">
                  {client.owner}
                </td>
                <td className="py-3 pr-4 text-sm text-gray-700">
                  {client.leads}
                </td>
                <td className="py-3">
                  <StatusPill status={client.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked view (mobile) */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto sm:hidden">
        {clients.map((client, index) => (
          <div
            key={client.id ?? index}
            className="rounded-xl bg-gray-50 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {client.name}
                </p>
                <p className="truncate text-xs text-gray-500">{client.owner}</p>
              </div>

              <StatusPill status={client.status} />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-900">
                {client.leads}
              </span>{" "}
              leads
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLeadsPerClient;
