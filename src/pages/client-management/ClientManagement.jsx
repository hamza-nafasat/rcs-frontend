import Card from "../../components/shared/Card";
import ClientManagementHeading from "./components/ClientManagementHeading";
import ClientTable from "./components/ClientTable";

const cardData = [
  {
    label: "Total Clients",
    value: "8",
    valueColor: "#2563EB",
  },
  {
    label: "Total Messages",
    value: "2",
    valueColor: "#06B6D4",
  },
  {
    label: "Total Leads",
    value: "7",
    valueColor: "#22C55E",
  },
  {
    label: "Converted Leads",
    value: "6",
    valueColor: "#F97316",
  },
];

const ClientManagement = () => {
  return (
    <section className="">
      <div className="">
        <ClientManagementHeading
          heading="Client Management"
          subheading="Manage your clients and their information"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-4 sm:grid lg:grid-cols-4">
        {cardData.map((card, index) => (
          <Card key={index} className="h-full">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: card.valueColor }}
                >
                  {card.value}
                </h2>
                <p className="text-sm font-medium text-muted">{card.label}</p>
              </div>
              <span className="text-sm font-medium text-success">
                {card.comparison}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <ClientTable />
      </div>
    </section>
  );
};

export default ClientManagement;
