import DataTable from "react-data-table-component";
import Avatar from "../../../../components/shared/Avatar";
import Dropdown from "../../../../components/shared/Dropdown";
import ProgressBar from "../../../../components/shared/ProgressBar";
import { Eye, MessageSquare, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { initialData } from "../utils/data";
import ClientDetailsModal from "../modals/ClientDetailsModal";
import ClientAddEditModal from "../modals/ClientAddEditModal";
import Button from "../../../../components/shared/Button";
import DeleteModal from "../../../../components/modals/DeleteModal";

const STATUS_STYLES = {
  Active: { pill: "bg-revenue text-[#22C55E]", dot: "bg-[#22C55E]" },
  "At Risk": { pill: "bg-[#FEF2F2] text-[#EF4444]", dot: "bg-[#EF4444]" },
  "On Hold": { pill: "bg-[#FFFBEB] text-[#F59E0B]", dot: "bg-[#F59E0B]" },
};

const HEALTH_COLORS = [
  { min: 80, color: "#22C55E" },
  { min: 60, color: "#FBBF24" },
  { min: 0, color: "#EF4444" },
];

const getHealthColor = (score) => HEALTH_COLORS.find(({ min }) => score >= min).color;

const emptyFilters = { restaurant: "", owner: "", status: [] };

const buildColumns = ({ handleEditClient, handleViewClient, setClientToDelete }) => [
  {
    name: "Restaurant",
    selector: (row) => row.restaurantName,
    sortable: true,
    minWidth: "220px",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <Avatar name={row.restaurantName} size={32} rounded="rounded-md" color="#F97316" />
        <div className="min-w-0">
          <p className="truncate text-sm text-gray-900">{row.restaurantName}</p>
          <p className="truncate text-xs text-gray-500">{row.restaurantCuisine}</p>
        </div>
      </div>
    ),
  },
  {
    name: "Owner",
    selector: (row) => row.ownerName,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    cell: (row) => {
      const { pill, dot } = STATUS_STYLES[row.status] ?? STATUS_STYLES["On Hold"];

      return (
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${pill}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          {row.status}
        </span>
      );
    },
  },
  {
    name: "Health Score",
    selector: (row) => row.healthScore,
    sortable: true,
    minWidth: "160px",
    cell: (row) => (
      <div className="flex w-full items-center gap-2">
        <ProgressBar value={row.healthScore} color={getHealthColor(row.healthScore)} />
        <span
          className="shrink-0 whitespace-nowrap text-xs font-medium"
          style={{ color: getHealthColor(row.healthScore) }}
        >
          {row.healthScore}%
        </span>
      </div>
    ),
  },
  {
    name: "Franchise",
    selector: (row) => row.franchise,
    sortable: true,
  },
  {
    name: "Actions",
    cell: (row) => (
      <div className="flex justify-end">
        <Dropdown
          align="right"
          portalClassName="max-w-12"
          trigger={
            <Button variant="menuTrigger">
              <MoreHorizontal size={18} />
            </Button>
          }
        >
          <Button variant="menuItem" onClick={() => handleEditClient(row)}>
            <Pencil size={16} className="mt-0.5" />
            Edit
          </Button>
          <Button variant="menuItem" onClick={() => handleViewClient(row)}>
            <Eye size={16} className="mt-0.5" />
            View
          </Button>
          <Button variant="menuItem" onClick={() => {}}>
            <MessageSquare size={14} className="mt-0.5" />
            Send Message
          </Button>

          <Button variant="menuItemDanger" onClick={() => setClientToDelete(row)}>
            <Trash2 size={16} className="shrink-0" />
            Delete
          </Button>
        </Dropdown>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

const ClientTable = ({ className, filters = emptyFilters }) => {
  const [clients, setClients] = useState(initialData);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewClient, setViewClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);

  const filteredClients = clients.filter((client) => {
    const matchRestaurant = client.restaurantName.toLowerCase().includes(filters.restaurant.trim().toLowerCase());

    const matchOwner = client.ownerName.toLowerCase().includes(filters.owner.trim().toLowerCase());

    const matchStatus = filters.status.length === 0 || filters.status.includes(client.status);

    return matchRestaurant && matchOwner && matchStatus;
  });

  const handleViewClient = (client) => {
    setViewClient({
      name: client.restaurantName,
      type: client.franchise,
      status: client.status,
      location: client.location ?? "—",
      owner: client.ownerName,
      email: client.clientEmail,
      phone: client.phone ?? "—",
      healthScore: client.healthScore,
      outstandingBalance: String(client.balance ?? "").replace("$", ""),
    });
  };

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

  const handleDeleteClient = () => {
    setClients((prev) => prev.filter((client) => client.id !== clientToDelete?.id));
    setClientToDelete(null);
  };

  const columns = buildColumns({ handleEditClient, handleViewClient, setClientToDelete });
  return (
    <section className={className}>
      <DataTable columns={columns} data={filteredClients} pagination highlightOnHover responsive />
      {isModalOpen && selectedClient && (
        <ClientAddEditModal
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

      <DeleteModal
        isOpen={Boolean(clientToDelete)}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleDeleteClient}
        heading="Delete Client"
        text={`Are you sure you want to delete ${clientToDelete?.restaurantName ?? "this client"}? This action cannot be undone.`}
        confirmText="Delete"
      />

      <ClientDetailsModal isOpen={Boolean(viewClient)} onClose={() => setViewClient(null)} client={viewClient} />
    </section>
  );
};

export default ClientTable;
