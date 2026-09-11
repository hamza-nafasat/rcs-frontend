import { useState } from "react";
import Avatar from "../../../../components/shared/Avatar";
import Button from "../../../../components/shared/Button";
import ProgressBar from "../../../../components/shared/ProgressBar";

const DashboardClientsNeedingAttention = ({
  clients = [],
  title = "Clients Needing Attention",
  initialCount = 4,
}) => {
  const [expanded, setExpanded] = useState(false);

  const hasMore = clients.length > initialCount;
  const visibleClients =
    expanded || !hasMore ? clients : clients.slice(0, initialCount);

  return (
    <div className="flex flex-col">
      <h3 className="mb-5 text-base font-semibold text-gray-900">{title}</h3>

      <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
        {visibleClients.map((client, index) => (
          <div
            key={client.id ?? index}
            className="rounded-xl bg-gray-50 p-3"
          >
            <div className="flex items-center gap-3">
              <Avatar name={client.name} src={client.avatar} size={40} />

              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {client.name}
                </p>

                <p className="text-xs text-gray-500">{client.personName}</p>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2 pl-11">
              <ProgressBar
                value={client.progress}
                color={client.progressColor}
              />

              <span
                className="text-xs font-medium"
                style={{
                  color: client.progressColor,
                }}
              >
                {client.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View more */}
      {hasMore && (
        <div className="flex justify-center pt-3">
          <Button
            variant="bare"
            className="text-sm font-medium text-orange-500"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "View less" : "View more"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardClientsNeedingAttention;
