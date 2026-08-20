import DataTable from "react-data-table-component";
import Avatar from "../../../components/shared/Avatar";
import Dropdown from "../../../components/shared/Dropdown";
import ProgressBar from "../../../components/shared/ProgressBar";
import {
  Eye,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import ClientDetailsModal from "./ClientDetailsModal";
import AddEditClientModal from "./AddEditClientModal";
import Button from "../../../components/shared/Button";
import DeleteModal from "../../../components/modals/DeleteModal";

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

const getHealthColor = (score) =>
  HEALTH_COLORS.find(({ min }) => score >= min).color;

const initialData = [
  {
    id: 1,
    ownerName: "John Doe",
    clientEmail: "john@example.com",
    restaurantName: "The Harbor Kitchen",
    restaurantCuisine: "Seafood",
    status: "Active",
    healthScore: 92,
    franchise: "KFC",
    balance: "$1,200",
    nextMeeting: "2023-08-15",
  },
  {
    id: 2,
    ownerName: "Jane Smith",
    clientEmail: "jane@example.com",
    restaurantName: "Sunset Grill",
    restaurantCuisine: "American",
    status: "On Hold",
    healthScore: 48,
    franchise: "Burger King",
    balance: "$800",
    nextMeeting: "2023-08-20",
  },
  {
    id: 3,
    ownerName: "Marcus Williams",
    clientEmail: "marcus@example.com",
    restaurantName: "The Rustic Table",
    restaurantCuisine: "Italian",
    status: "At Risk",
    healthScore: 55,
    franchise: "Subway",
    balance: "$2,400",
    nextMeeting: "2023-08-18",
  },
  {
    id: 4,
    ownerName: "Priya Patel",
    clientEmail: "priya@example.com",
    restaurantName: "Spice Route",
    restaurantCuisine: "Indian",
    status: "Pending",
    healthScore: 71,
    franchise: "Domino's",
    balance: "$540",
    nextMeeting: "2023-08-22",
  },
  {
    id: 5,
    ownerName: "Ana Torres",
    clientEmail: "ana@example.com",
    restaurantName: "Coastal Bistro",
    restaurantCuisine: "Mediterranean",
    status: "Active",
    healthScore: 84,
    franchise: "KFC",
    balance: "$1,800",
    nextMeeting: "2023-08-25",
  },
  {
    id: 4,
    ownerName: "Priya Patel",
    clientEmail: "priya@example.com",
    restaurantName: "Spice Route",
    restaurantCuisine: "Indian",
    status: "Pending",
    healthScore: 71,
    franchise: "Domino's",
    balance: "$540",
    nextMeeting: "2023-08-22",
  },
  {
    id: 5,
    ownerName: "Ana Torres",
    clientEmail: "ana@example.com",
    restaurantName: "Coastal Bistro",
    restaurantCuisine: "Mediterranean",
    status: "Active",
    healthScore: 84,
    franchise: "KFC",
    balance: "$1,800",
    nextMeeting: "2023-08-25",
  },
  {
    id: 4,
    ownerName: "Priya Patel",
    clientEmail: "priya@example.com",
    restaurantName: "Spice Route",
    restaurantCuisine: "Indian",
    status: "Pending",
    healthScore: 71,
    franchise: "Domino's",
    balance: "$540",
    nextMeeting: "2023-08-22",
  },
  {
    id: 5,
    ownerName: "Ana Torres",
    clientEmail: "ana@example.com",
    restaurantName: "Coastal Bistro",
    restaurantCuisine: "Mediterranean",
    status: "Active",
    healthScore: 84,
    franchise: "KFC",
    balance: "$1,800",
    nextMeeting: "2023-08-25",
  },
  {
    id: 4,
    ownerName: "Priya Patel",
    clientEmail: "priya@example.com",
    restaurantName: "Spice Route",
    restaurantCuisine: "Indian",
    status: "Pending",
    healthScore: 71,
    franchise: "Domino's",
    balance: "$540",
    nextMeeting: "2023-08-22",
  },
  {
    id: 5,
    ownerName: "Ana Torres",
    clientEmail: "ana@example.com",
    restaurantName: "Coastal Bistro",
    restaurantCuisine: "Mediterranean",
    status: "Active",
    healthScore: 84,
    franchise: "KFC",
    balance: "$1,800",
    nextMeeting: "2023-08-25",
  },
  {
    id: 4,
    ownerName: "Priya Patel",
    clientEmail: "priya@example.com",
    restaurantName: "Spice Route",
    restaurantCuisine: "Indian",
    status: "Pending",
    healthScore: 71,
    franchise: "Domino's",
    balance: "$540",
    nextMeeting: "2023-08-22",
  },
  {
    id: 5,
    ownerName: "Ana Torres",
    clientEmail: "ana@example.com",
    restaurantName: "Coastal Bistro",
    restaurantCuisine: "Mediterranean",
    status: "Active",
    healthScore: 84,
    franchise: "KFC",
    balance: "$1,800",
    nextMeeting: "2023-08-25",
  },
  {
    id: 4,
    ownerName: "Priya Patel",
    clientEmail: "priya@example.com",
    restaurantName: "Spice Route",
    restaurantCuisine: "Indian",
    status: "Pending",
    healthScore: 71,
    franchise: "Domino's",
    balance: "$540",
    nextMeeting: "2023-08-22",
  },
  {
    id: 5,
    ownerName: "Ana Torres",
    clientEmail: "ana@example.com",
    restaurantName: "Coastal Bistro",
    restaurantCuisine: "Mediterranean",
    status: "Active",
    healthScore: 84,
    franchise: "KFC",
    balance: "$1,800",
    nextMeeting: "2023-08-25",
  },
  {
    id: 4,
    ownerName: "Priya Patel",
    clientEmail: "priya@example.com",
    restaurantName: "Spice Route",
    restaurantCuisine: "Indian",
    status: "Pending",
    healthScore: 71,
    franchise: "Domino's",
    balance: "$540",
    nextMeeting: "2023-08-22",
  },
  {
    id: 5,
    ownerName: "Ana Torres",
    clientEmail: "ana@example.com",
    restaurantName: "Coastal Bistro",
    restaurantCuisine: "Mediterranean",
    status: "Active",
    healthScore: 84,
    franchise: "KFC",
    balance: "$1,800",
    nextMeeting: "2023-08-25",
  },
];

const ClientTable = ({ className }) => {
  const [clients, setClients] = useState(initialData);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewClient, setViewClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);

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

  const columns = [
    {
      name: "Restaurant",
      selector: (row) => row.restaurantName,
      sortable: true,
      minWidth: "220px",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar
            name={row.restaurantName}
            size={32}
            rounded="rounded-md"
            color="#F97316"
          />
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-900">
              {row.restaurantName}
            </p>
            <p className="truncate text-xs text-gray-500">
              {row.restaurantCuisine}
            </p>
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
        const { pill, dot } =
          STATUS_STYLES[row.status] ?? STATUS_STYLES["On Hold"];

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
          <ProgressBar
            value={row.healthScore}
            color={getHealthColor(row.healthScore)}
          />
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
              <Button
                type="icon"
                className="w-full py-2! px-3!"
                textClassName="flex w-full item-center h-full gap-2 text-sm text-gray-700 transition hover:bg-gray-100  "
              >
                <MoreHorizontal size={18} />
              </Button>
            }
          >
            <Button
              type="icon"
              className="w-full py-0! px-0!"
              textClassName="flex py-2 px-3 w-full item-center h-full gap-2 text-sm text-gray-700 transition hover:bg-gray-100  "
              onClick={() => handleEditClient(row)}
            >
              <Pencil size={16} className="mt-0.5" />
              Edit
            </Button>
            <Button
              type="icon"
              className="w-full py-0! px-0!"
              textClassName="flex w-full px-3 py-2 item-center h-full gap-2 text-sm text-gray-700 transition hover:bg-gray-100  "
              onClick={() => handleViewClient(row)}
            >
              <Eye size={16} className="mt-0.5" />
              View
            </Button>
            <Button
              type="icon"
              className="w-full py-0! px-0!"
              textClassName="flex w-full px-3 py-2 item-center h-full gap-2 text-sm text-gray-700 transition hover:bg-gray-100  "
              onClick={() => handleEditClient(row)}
            >
              <MessageSquare size={14} className="mt-0.5" />
              Send Message
            </Button>

            <Button
              type="icon"
              className="w-full py-0! px-0! border-t border-gray-300 rounded-none!"
              textClassName="flex w-full py-2 px-3 item-center h-full gap-2 text-sm text-gray-700 transition hover:bg-gray-100 border-gray-300 text-left text-sm text-red-600 transition hover:bg-red-50 "
              onClick={() => setClientToDelete(row)}
            >
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

  return (
    <div className={className}>
      <DataTable
        columns={columns}
        data={clients}
        pagination
        highlightOnHover
        responsive
      />
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

      <DeleteModal
        isOpen={Boolean(clientToDelete)}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleDeleteClient}
        heading="Delete Client"
        text={`Are you sure you want to delete ${clientToDelete?.restaurantName ?? "this client"}? This action cannot be undone.`}
        confirmText="Delete"
      />

      <ClientDetailsModal
        isOpen={Boolean(viewClient)}
        onClose={() => setViewClient(null)}
        client={viewClient}
      />
    </div>
  );
};

export default ClientTable;
