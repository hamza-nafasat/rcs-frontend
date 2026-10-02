import { useState } from "react";
import DataTable from "../DataTable";
import toast from "react-hot-toast";
import { ChevronDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Avatar from "../../shared/Avatar";
import Button from "../../shared/Button";
import Dropdown from "../../shared/Dropdown";
import DeleteModal from "../../modals/DeleteModal";
import ModeratorAddEditModal from "../../modals/ModeratorAddEditModal";
import ModeratorDetailsModal from "../../modals/ModeratorDetailsModal";
import { MODERATOR_STATUS } from "../../../utils/moderatorStatus";
import { useDeleteModeratorMutation, useUpdateModeratorMutation } from "../../../store/apis/shared/moderator.apis";

const buildColumns = ({ setMemberToEdit, setViewMember, setMemberToRemove }) => [
  {
    name: "Member",
    selector: (row) => row.fullName,
    sortable: true,
    minWidth: "240px",
    grow: 2,
    cell: (row) => (
      <div className="flex min-w-0 items-center gap-2">
        <Avatar name={row.fullName} src={row.image?.url} size={32} rounded="rounded-lg" color="#F97316" />
        <div className="min-w-0">
          <p className="wrap-break-word text-sm text-gray-900">{row.fullName}</p>
          <p className="wrap-break-word text-xs text-gray-500">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    name: "Role",
    selector: () => "Moderator",
    grow: 1,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    grow: 1,
    cell: (row) => {
      const { label, pill, dot } = MODERATOR_STATUS[row.status] ?? MODERATOR_STATUS.inactive;

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
    name: "Joined",
    selector: (row) => row.createdAt,
    sortable: true,
    minWidth: "160px",
    grow: 1,
    cell: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
  {
    name: <div className="pr-5">Actions</div>,
    width: "90px",
    right: true,
    cell: (row) => (
      <div className="flex justify-end pr-6">
        <Dropdown
          align="right"
          portalClassName="max-w-12"
          trigger={
            <Button variant="menuTrigger">
              <MoreHorizontal size={18} />
            </Button>
          }
        >
          <Button variant="menuItem" onClick={() => setMemberToEdit(row)}>
            <Pencil size={16} className="mt-0.5" />
            Edit
          </Button>
          <Button variant="menuItem" onClick={() => setViewMember(row)}>
            <Eye size={16} className="mt-0.5" />
            View
          </Button>
          <Button variant="menuItemDanger" onClick={() => setMemberToRemove(row)}>
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

const ModeratorTable = ({ moderators = [], isLoading = false }) => {
  const [updateModerator, { isLoading: isUpdating }] = useUpdateModeratorMutation();
  const [deleteModerator, { isLoading: isDeleting }] = useDeleteModeratorMutation();
  const [viewMember, setViewMember] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [memberToEdit, setMemberToEdit] = useState(null);

  const handleUpdateMember = async (formData) => {
    try {
      const response = await updateModerator({ id: memberToEdit?._id, ...formData }).unwrap();
      toast.success(response?.message);
      setMemberToEdit(null);
    } catch (error) {
      console.error("Update moderator error:", error);
    }
  };

  const handleConfirmRemove = async () => {
    try {
      const response = await deleteModerator(memberToRemove?._id).unwrap();
      toast.success(response?.message);
      setMemberToRemove(null);
    } catch (error) {
      console.error("Delete moderator error:", error);
    }
  };

  const columns = buildColumns({ setMemberToEdit, setViewMember, setMemberToRemove });
  return (
    <section className="flex h-full w-full min-h-0 flex-col">
      <DataTable
        columns={columns}
        data={moderators}
        isLoading={isLoading}
        fillHeight
        pagination
        fixedHeader
        fixedHeaderScrollHeight="100%"
        sortIcon={<ChevronDown size={14} />}
        className="flex min-h-0 flex-1 flex-col"
      />

      {memberToEdit && (
        <ModeratorAddEditModal
          isOpen={Boolean(memberToEdit)}
          onClose={() => setMemberToEdit(null)}
          onSubmit={handleUpdateMember}
          isSubmitting={isUpdating}
          initialData={memberToEdit}
          mode="edit"
        />
      )}

      <ModeratorDetailsModal
        isOpen={Boolean(viewMember)}
        onClose={() => setViewMember(null)}
        member={viewMember}
        onEdit={(member) => {
          setViewMember(null);
          setMemberToEdit(member);
        }}
        onRemove={(member) => {
          setViewMember(null);
          setMemberToRemove(member);
        }}
      />

      <DeleteModal
        isOpen={Boolean(memberToRemove)}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleConfirmRemove}
        heading="Remove Moderator"
        text={`Are you sure you want to remove ${memberToRemove?.fullName ?? "this moderator"}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </section>
  );
};

export default ModeratorTable;
