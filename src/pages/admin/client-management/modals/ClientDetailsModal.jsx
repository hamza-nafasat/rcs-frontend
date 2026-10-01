import { Mail, MapPin, Phone, Star, X } from "lucide-react";
import MapLocationAssign from "../../../../components/global/map/MapLocationAssign";
import Avatar from "../../../../components/shared/Avatar";
import Button from "../../../../components/shared/Button";
import Loader from "../../../../components/shared/Loader";
import { useGetClientByIdQuery } from "../../../../store/apis/admin/client.apis";
import { withMapId } from "../../../../utils/mapHelpers";
import ClientDetailSummary from "../components/ClientDetailSummary";
import { CLIENT_STATUS, getClientStatus } from "../utils/clientStatus";
import { formatPhone } from "../../../../utils/formatPhone";

const ClientDetailsModal = ({ isOpen, onClose, clientId }) => {
  const { data, isFetching } = useGetClientByIdQuery(clientId, { skip: !clientId });
  const client = data?.data;

  if (!isOpen) return null;
  if (!client) return isFetching ? <Loader className="fixed inset-0 z-50 bg-black/40" /> : null;

  const account = client?.account;
  const location = [account?.city, account?.state].filter(Boolean).join(", ") || "—";
  const { label, pill, dot } = CLIENT_STATUS[getClientStatus(client)] ?? CLIENT_STATUS.pending;

  const contactInfo = [
    { icon: Star, label: "Owner", value: account?.fullName },
    { icon: Mail, label: "Email", value: account?.email },
    { icon: Phone, label: "Phone", value: formatPhone(account?.phone) || "—" },
    { icon: MapPin, label: "Location", value: location },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <article className="mb-6 flex items-start justify-between">
          <section className="flex items-center gap-3">
            <Avatar name={client.restaurantName} />

            <div>
              <h2 className="text-xl font-semibold text-tertiary">{client.restaurantName}</h2>
              <p className="mt-0.5 text-sm text-secondary">
                {client.restaurantCuisine ?? "—"} · {location}
              </p>
              <span
                className={`mt-2 inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${pill}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                {label}
              </span>
            </div>
          </section>

          <Button
            variant="bare"
            onClick={onClose}
            aria-label="Close"
            className="p-1! m-1! rounded-full! text-secondary transition hover:bg-gray-100"
          >
            <X size={20} />
          </Button>
        </article>

        {/* Content */}
        <article className="space-y-4">
          {/* Health Score */}
          <section className="rounded-xl border color-border bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-tertiary">Health Score</h3>
              <span className="text-lg font-bold text-primary">
                {client.healthScore == null ? "—" : `${client.healthScore}%`}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-(--color-primary)"
                style={{ width: `${client.healthScore ?? 0}%` }}
              />
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-tertiary">Contact Information</h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {contactInfo.map(({ icon: Icon, label: field, value }) => (
                <div key={field} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border color-border bg-gray-50">
                    <Icon size={16} className="text-secondary" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-secondary">{field}</p>
                    <p className="truncate text-sm text-tertiary">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <ClientDetailSummary client={client} />

          {/* Franchises and areas */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-tertiary">Franchises &amp; Areas</h3>

            <MapLocationAssign
              franchises={withMapId(client?.franchises ?? [])}
              areas={withMapId(client?.territories ?? [])}
              canEdit={false}
            />
          </section>

          {/* Quick Actions */}
          {/* <section>
            <h3 className="mb-3 text-sm font-semibold text-tertiary">Quick Actions</h3>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="bare"
                onClick={handleMessage}
                className="flex h-16 w-full flex-col items-center justify-center gap-1 rounded-xl border color-border text-sm text-secondary transition hover:bg-gray-50"
              >
                <span className="flex flex-col items-center gap-1">
                  <MessageSquare size={18} />
                  <span>Message</span>
                </span>
              </Button>

              <Button
                variant="bare"
                onClick={handleWebsite}
                className="flex h-16 w-full flex-col items-center justify-center gap-1 rounded-xl border color-border text-sm text-secondary transition hover:bg-gray-50"
              >
                <span className="flex flex-col items-center gap-1">
                  <Globe size={18} />
                  <span>Website</span>
                </span>
              </Button>
            </div>
          </section> */}
        </article>
      </div>
    </div>
  );
};

export default ClientDetailsModal;
