import {
  X,
  Star,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Globe,
} from "lucide-react";
import Avatar from "../../../../components/shared/Avatar";
import Button from "../../../../components/shared/Button";
import Loader from "../../../../components/shared/Loader";
import { CLIENT_STATUS, getClientStatus } from "../utils/clientStatus";
import { useGetClientByIdQuery } from "../../../../store/apis/admin/client.apis";

const ClientDetailsModal = ({ isOpen, onClose, clientId }) => {
  const { data, isFetching } = useGetClientByIdQuery(clientId, { skip: !clientId });
  const client = data?.data;

  if (!isOpen) return null;
  if (!client) return isFetching ? <Loader className="fixed inset-0 z-50 bg-black/40" /> : null;

  const account = client?.account;
  const location = [account?.city, account?.state].filter(Boolean).join(", ") || "—";
  const { label, pill, dot } = CLIENT_STATUS[getClientStatus(client)] ?? CLIENT_STATUS.pending;

  const contactInfo = [
    {
      icon: Star,
      label: "Owner",
      value: account?.fullName,
    },
    {
      icon: Mail,
      label: "Email",
      value: account?.email,
    },
    {
      icon: Phone,
      label: "Phone",
      value: account?.phone ?? "—",
    },
    {
      icon: MapPin,
      label: "Location",
      value: location,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-125 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <article className="mb-6 flex items-start justify-between">
          <section className="flex items-center gap-3">
            <Avatar name={client.restaurantName} />

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {client.restaurantName}
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                {client.restaurantCuisine ?? "—"} · {location}
              </p>

              <span className={`mt-2 inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${pill}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                {label}
              </span>
            </div>
          </section>

          <Button
            variant="bare"
            onClick={onClose}
            className="p-1! m-1! text-gray-500 hover:bg-gray-100 transition rounded-full! "
          >
            <X size={20} />
          </Button>
        </article>

        {/* Content */}
        <article className="space-y-4">
          {/* Health Score */}
          <section className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Health Score
              </h3>

              <span className="text-lg font-bold text-orange-500">
                {client.healthScore == null ? "—" : `${client.healthScore}%`}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-orange-500"
                style={{ width: `${client.healthScore ?? 0}%` }}
              />
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Contact Information
            </h3>

            <div className="space-y-3">
              {contactInfo.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                      <Icon size={16} className="text-gray-500" />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>

                      <p className="text-sm text-gray-900">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="bare"
                className="flex h-16 flex-col w-full items-center justify-center gap-1 rounded-xl border border-gray-200 text-sm text-gray-500 transition hover:bg-gray-50"
              >
                <span className="flex flex-col items-center gap-1 ">
                  <MessageSquare size={18} />
                  <span>Message</span>
                </span>
              </Button>

              <Button
                variant="bare"
                className="flex h-16 flex-col w-full items-center justify-center gap-1 rounded-xl border border-gray-200 text-sm text-gray-500 transition hover:bg-gray-50"
              >
                <span className="flex flex-col items-center gap-1 ">
                  <Globe size={18} />
                  <span>Website</span>
                </span>
              </Button>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default ClientDetailsModal;
