import { Eye, MoreHorizontal, Pencil, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import DeleteModal from "../../../../components/modals/DeleteModal";
import Avatar from "../../../../components/shared/Avatar";
import Button from "../../../../components/shared/Button";
import Dropdown from "../../../../components/shared/Dropdown";
import ProgressBar from "../../../../components/shared/ProgressBar";
import {
  useDeleteClientMutation,
  useResendClientInviteMutation,
  useUpdateClientMutation,
} from "../../../../store/apis/admin/client.apis";
import ClientAddEditModal from "../modals/ClientAddEditModal";
import ClientDetailsModal from "../modals/ClientDetailsModal";
import { CLIENT_STATUS, getClientStatus } from "../utils/clientStatus";

const HEALTH_COLORS = [
  { min: 80, color: "#22C55E" },
  { min: 60, color: "#FBBF24" },
  { min: 0, color: "#EF4444" },
];

const getHealthColor = (score) => HEALTH_COLORS.find(({ min }) => score >= min).color;

const buildColumns = ({ handleEditClient, handleViewClient, handleResendInvite, setClientToDelete }) => [
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
    selector: (row) => row?.account?.fullName,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.account?.email,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => CLIENT_STATUS[getClientStatus(row)]?.label,
    sortable: true,
    cell: (row) => {
      const { label, pill, dot } = CLIENT_STATUS[getClientStatus(row)] ?? CLIENT_STATUS.pending;

      return (
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${pill}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          {label}
        </span>
      );
    },
  },
  {
    name: "Health Score",
    selector: (row) => row.healthScore ?? -1,
    sortable: true,
    minWidth: "160px",
    cell: (row) =>
      row.healthScore == null ? (
        <span className="text-xs text-gray-500">—</span>
      ) : (
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
          {getClientStatus(row) === "invited" && (
            <Button variant="menuItem" onClick={() => handleResendInvite(row)}>
              <Send size={14} className="mt-0.5" />
              Resend Invite
            </Button>
          )}

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

const ClientTable = ({ className, clients = [], isLoading = false }) => {
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();
  const [resendClientInvite] = useResendClientInviteMutation();
  const [clientToEdit, setClientToEdit] = useState(null);
  const [viewClientId, setViewClientId] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);

  const handleViewClient = (client) => setViewClientId(client?._id);

  const handleEditClient = (client) => setClientToEdit(client);

  const handleUpdateClient = async (formData) => {
    try {
      const response = await updateClient({ id: clientToEdit?._id, ...formData }).unwrap();
      toast.success(response?.message);
      setClientToEdit(null);
    } catch (error) {
      console.error("Update client error:", error);
    }
  };

  const handleDeleteClient = async () => {
    try {
      const response = await deleteClient(clientToDelete?._id).unwrap();
      toast.success(response?.message);
      setClientToDelete(null);
    } catch (error) {
      console.error("Delete client error:", error);
    }
  };

  const handleResendInvite = async (client) => {
    try {
      const response = await resendClientInvite(client?._id).unwrap();
      toast.success(response?.message);
    } catch (error) {
      console.error("Resend invite error:", error);
    }
  };

  const columns = buildColumns({ handleEditClient, handleViewClient, handleResendInvite, setClientToDelete });
  return (
    <section className={className}>
      <DataTable columns={columns} data={clients} progressPending={isLoading} pagination highlightOnHover responsive />
      {clientToEdit && (
        <ClientAddEditModal
          isOpen={Boolean(clientToEdit)}
          onClose={() => setClientToEdit(null)}
          onSubmit={handleUpdateClient}
          isSubmitting={isUpdating}
          initialData={{
            restaurantName: clientToEdit?.restaurantName,
            clientEmail: clientToEdit?.account?.email,
            firstName: clientToEdit?.account?.firstName,
            lastName: clientToEdit?.account?.lastName,
          }}
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
        isLoading={isDeleting}
      />

      <ClientDetailsModal
        isOpen={Boolean(viewClientId)}
        onClose={() => setViewClientId(null)}
        clientId={viewClientId}
      />
    </section>
  );
};

export default ClientTable;
