import Button from "../../../../components/shared/Button";
import SupportPill from "../../../../components/global/support/SupportPill";
import DashboardHeading from "../../../../components/global/DashboardHeading";
import { SUPPORT_STATUS } from "../../../../utils/supportStatus";


const DashboardRecentSupports = ({ tickets = [], isLoading = false, onViewAll }) => {

  return (
    <>
      <header className="mb-5 flex items-start justify-between gap-3">
        <DashboardHeading heading="Recent Supports" subheading="Latest tickets from clients" />

        {onViewAll && (
          <Button type="button" onClick={onViewAll} className="shrink-0 px-4! py-2! text-xs text-white">
            View All
          </Button>
        )}
      </header>

      {tickets.length === 0 ? (
        <p className="py-8 text-center text-sm text-secondary">
          {isLoading ? "Loading tickets…" : "No tickets yet"}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b color-border text-left text-xs text-secondary">
                <th className="pb-2 pr-3 font-medium">Ticket</th>
                <th className="pb-2 pr-3 font-medium">Raised By</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="border-b color-border last:border-0">
                  <td className="py-3 pr-3">
                    <p className="truncate text-sm font-medium text-tertiary">{ticket?.subject}</p>
                    <p className="truncate text-xs text-muted">{ticket?.ticketId}</p>
                  </td>

                  <td className="py-3 pr-3 text-sm text-tablecell">
                    {ticket?.restaurant?.restaurantName ?? ticket?.raisedBy?.fullName ?? "—"}
                  </td>

                  <td className="py-3">
                    <SupportPill {...(SUPPORT_STATUS[ticket?.status] ?? SUPPORT_STATUS.in_progress)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default DashboardRecentSupports;
