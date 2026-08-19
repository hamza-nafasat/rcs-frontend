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
    <>
      <section className="">
        <ClientManagementHeading
          heading="Client Management"
          subheading="Manage your clients and their information"
        />
      </section>

      <section className="mt-6 flex flex-wrap gap-4 sm:grid lg:grid-cols-4">
        {cardData.map((card, index) => (
          <Card key={index} className="h-full">
            <div className="flex flex-col gap-1">
              <h2
                className="text-lg font-semibold"
                style={{ color: card.valueColor }}
              >
                {card.value}
              </h2>
              <p className="text-sm font-medium text-muted">{card.label}</p>
            </div>
          </Card>
        ))}
      </section>
      <ClientTable className="mt-5" />
    </>
  );
};

export default ClientManagement;
