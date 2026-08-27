import Card from "../../../components/shared/Card";
import ClientManagementHeading from "./components/ClientManagementHeading";
import ClientTable from "./components/ClientTable";
import ClientFilter from "./components/ClientFilter";
import { initialData } from "./components/clientsData";
import { useState } from "react";

const cardData = [
  {
    label: "Total Clients",
    value: "8",
    valueColor: "#2563EB",
  },
  {
    label: "Total Messages",
    value: "2",
    valueColor: "#22C55E",
  },
  {
    label: "Total Leads",
    value: "7",
    valueColor: "#EF4444",
  },
  {
    label: "Converted Leads",
    value: "6",
    valueColor: "#F59E0B",
  },
];

const initialFilters = {
  restaurant: "",
  owner: "",
  status: [],
};

const ClientManagement = () => {
  const [filters, setFilters] = useState(initialFilters);

  // this list will come from the backend later
  const statuses = [...new Set(initialData.map((client) => client.status))];

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

      <section className="mt-6 gap-4 grid grid-cols-2 lg:grid-cols-4">
        {cardData.map((card, index) => (
          <Card key={index} className="h-full">
            <div className="flex flex-col gap-1">
              <h2
                className="text-lg font-semibold"
                style={{ color: card.valueColor }}
              >
                {card.value}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-muted">
                {card.label}
              </p>
            </div>
          </Card>
        ))}
      </section>
      <ClientTable className="mt-5" filters={filters} />
    </>
  );
};

export default ClientManagement;
