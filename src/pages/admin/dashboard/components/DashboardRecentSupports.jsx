import Button from "../../../../components/shared/Button";
import SupportPill from "../../../../components/global/support/SupportPill";
import DashboardHeading from "../../../../components/global/DashboardHeading";
import { SUPPORT_PRIORITY, SUPPORT_STATUS } from "../../../../utils/supportStatus";


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
          {/* a minimum width keeps the pills whole */}
          <table className="w-full min-w-[600px] table-fixed">
            <thead>
              <tr className="border-b color-border text-left text-xs text-secondary">
                <th className="w-[20%] pb-2 pr-3 font-medium">Ticket ID</th>
                <th className="w-[16%] pb-2 pr-3 font-medium">Category</th>
                <th className="w-[18%] pb-2 pr-3 font-medium">Priority</th>
                <th className="w-[22%] pb-2 pr-3 font-medium">Status</th>
                <th className="w-[24%] pb-2 font-medium">Raised By</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="border-b color-border last:border-0">
                  <td className="break-words py-3 pr-3 text-sm font-medium text-tertiary">
                    {ticket?.ticketId ?? "—"}
                  </td>

                  <td className="break-words py-3 pr-3 text-sm text-tablecell">{ticket?.category ?? "—"}</td>

                  <td className="whitespace-nowrap py-3 pr-3">
                    <SupportPill
                      label={ticket?.priority}
                      {...(SUPPORT_PRIORITY[ticket?.priority] ?? SUPPORT_PRIORITY.Low)}
                    />
                  </td>

                  <td className="whitespace-nowrap py-3 pr-3">
                    <SupportPill {...(SUPPORT_STATUS[ticket?.status] ?? SUPPORT_STATUS.in_progress)} />
                  </td>

                  <td className="break-words py-3 text-sm text-tablecell">
                    {ticket?.restaurant?.restaurantName ?? ticket?.raisedBy?.fullName ?? "—"}
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
