import Avatar from "../../../components/shared/Avatar";
import ProgressBar from "./ProgressBar";

const ClientsNeedingAttention = ({
  clients = [],
  title = "Clients Needing Attention",
}) => {
  return (
    <div>
      <h3 className="mb-5 text-base font-semibold text-gray-900">{title}</h3>

      <div className="space-y-3">
        {clients.map((client) => (
          <div key={client.id} className="rounded-xl bg-gray-50 p-3">
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
    </div>
  );
};

export default ClientsNeedingAttention;
