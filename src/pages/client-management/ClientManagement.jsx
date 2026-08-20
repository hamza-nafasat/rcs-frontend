import Card from "../../components/shared/Card";
import ClientManagementHeading from "./components/ClientManagementHeading";
import ClientTable from "./components/ClientTable";

const cardData = [
  {
    label: "Total Clients",
    value: "8",
  },
  {
    label: "Active",
    value: "2",
  },
  {
    label: "At Risk",
    value: "7",
  },
  {
    label: "On Hold",
    value: "6",
  },
];

const valueColor = {
  totalClients: "#2563EB",
  totalMessages: "#22C55E",
  totalLeads: "#EF4444",
  convertedLeads: "#F59E0B",
};

const ClientManagement = () => {
  return (
    <>
      <section className="">
        <ClientManagementHeading
          heading="Client Management"
          subheading="Manage your clients and their information"
        />
      </section>

      <section className="mt-6 gap-4 grid grid-cols-2 lg:grid-cols-4">
        {cardData.map((card, index) => (
          <Card key={index} className="h-full">
            <div className="flex flex-col gap-1">
              <h2
                className="text-lg font-semibold"
                style={{ color: valueColor }}
              >
                {card.value}
              </h2>
              <p className="text-xs text-muted">{card.label}</p>
            </div>
          </Card>
        ))}
      </section>
      <ClientTable className="mt-5" />
    </>
  );
};

export default ClientManagement;
