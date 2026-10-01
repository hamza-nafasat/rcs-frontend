import ClientManagementHeading from "./components/ClientManagementHeading";
import ClientTable from "./components/ClientTable";
import ClientFilter from "./components/ClientFilter";
import { useState } from "react";
import { CLIENT_STATUS, getClientStatus, isDeactivatedClient } from "./utils/clientStatus";
import { useGetAllClientsQuery } from "../../../store/apis/admin/client.apis";

const initialFilters = {
  restaurant: "",
  owner: "",
  status: [],
  accountStatus: "",
};

const includesText = (text, query) => String(text ?? "").toLowerCase().includes(query.trim().toLowerCase());

const ClientManagement = () => {
  const [filters, setFilters] = useState(initialFilters);
  const { data, isLoading } = useGetAllClientsQuery();
  const clients = data?.data ?? [];

  const statuses = [...new Set(clients.map(getClientStatus))].map((status) => ({
    value: status,
    label: CLIENT_STATUS[status]?.label ?? status,
  }));

  const filteredClients = clients.filter((client) => {
    const matchRestaurant = includesText(client?.restaurantName, filters.restaurant);
    const matchOwner = includesText(client?.account?.fullName, filters.owner);
    const matchStatus = filters.status.length === 0 || filters.status.includes(getClientStatus(client));
    const accountStatus = isDeactivatedClient(client) ? "deactivated" : "active";
    const matchAccount = !filters.accountStatus || filters.accountStatus === accountStatus;

    return matchRestaurant && matchOwner && matchStatus && matchAccount;
  });

  return (
    <>
      <section className="">
        <ClientManagementHeading
          heading="Client Management"
          subheading="Manage your clients and their information"
        />
      </section>

      <section className="mt-6">
        <ClientFilter
          filters={filters}
          setFilters={setFilters}
          statuses={statuses}
        />
      </section>

      <ClientTable className="mt-5" clients={filteredClients} isLoading={isLoading} />
    </>
  );
};

export default ClientManagement;
