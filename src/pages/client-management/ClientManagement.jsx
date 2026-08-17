import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

import Card from "../../components/shared/Card";
import Dropdown from "../../components/shared/Dropdown";
import Table from "../../components/shared/Table";
import AddEditClientModal from "./components/AddEditClientModal";
import ClientDetailsModal from "./components/ClientDetailsModal";
import ClientManagementHeading from "./components/ClientManagementHeading";

const cardData = [
  {
    value: "8",
    label: "Total Clients",
  },
  {
    value: "2",
    label: "Total Messages",
  },
  {
    value: "7",
    label: "Total Leads",
  },
  {
    value: "6",
    label: "Total Leads",
  },
];

const initialData = [
  {
    id: 1,
    ownerName: "John Doe",
    clientEmail: "john@example.com",
    restaurantName: "The Harbor Kitchen",
    status: "Admin",
    healthScore: "Active",
    franchise: "KFC",
    balance: "$1,200",
    nextMeeting: "2023-08-15",
  },
  {
    id: 2,
    ownerName: "Jane Smith",
    clientEmail: "jane@example.com",
    restaurantName: "Sunset Grill",
    status: "User",
    healthScore: "Inactive",
    franchise: "Burger King",
    balance: "$800",
    nextMeeting: "2023-08-20",
  },
];

const ClientManagement = () => {
  const [clients, setClients] = useState(initialData);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewClient, setViewClient] = useState(null);

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleUpdateClient = (formData) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === selectedClient?.id
          ? {
              ...client,
              ownerName: formData.ownerName,
              clientEmail: formData.clientEmail,
              restaurantName: formData.restaurantName,
            }
          : client,
      ),
    );

    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleViewClient = (client) => {
    setViewClient({
      name: client.restaurantName,
      type: client.franchise,
      status: client.healthScore,
      location: client.location ?? "—",
      owner: client.ownerName,
      email: client.clientEmail,
      phone: client.phone ?? "—",
      healthScore: client.healthScoreValue ?? 0,
      outstandingBalance: String(client.balance ?? "").replace("$", ""),
    });
  };

  const columns = [
    {
      accessorKey: "restaurantName",
      header: "Restaurant",
    },
    {
      accessorKey: "ownerName",
      header: "Owner",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "healthScore",
      header: "Health Score",
    },
    {
      accessorKey: "franchise",
      header: "Franchise",
    },
    {
      accessorKey: "balance",
      header: "Balance",
    },
    {
      accessorKey: "nextMeeting",
      header: "Next Meeting",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Dropdown
            align="right"
            trigger={
              <button
                type="button"
                className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Open actions menu"
              >
                <MoreHorizontal size={18} />
              </button>
            }
          >
            <button
              type="button"
              className="flex w-full items-center px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
              onClick={() => handleEditClient(row.original)}
            >
              Edit
            </button>
            <button
              type="button"
              className="flex w-full items-center px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 border-t border-gray-300"
            >
              Delete
            </button>
            <button
              type="button"
              className="flex w-full items-center px-3 py-2 text-left text-sm text-blue-600 transition hover:bg-blue-50 border-t border-gray-300"
              onClick={() => handleViewClient(row.original)}
            >
              View
            </button>
          </Dropdown>
        </div>
      ),
    },
  ];

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
                <p className="text-sm font-medium text-muted">{card.label}</p>
                <h2 className="text-lg font-semibold text-tertiary">
                  {card.value}
                </h2>
              </div>
              <span className="text-sm font-medium text-success">
                {card.comparison}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Table data={clients} columns={columns} />
      </div>

      {isModalOpen && selectedClient && (
        <AddEditClientModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedClient(null);
          }}
          onSubmit={handleUpdateClient}
          initialData={selectedClient}
          mode="edit"
        />
      )}

      <ClientDetailsModal
        isOpen={Boolean(viewClient)}
        onClose={() => setViewClient(null)}
        client={viewClient}
      />
    </section>
  );
};

export default ClientManagement;
