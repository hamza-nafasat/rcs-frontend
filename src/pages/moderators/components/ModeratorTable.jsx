import DataTable from "react-data-table-component";
import { ChevronDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import ManageAccountsModal from "./ManageAccountsModal";
import AddEditModeratorModal from "./AddEditModeratorModal";
import DeleteModal from "../../../components/modals/DeleteModal";
import Avatar from "../../../components/shared/Avatar";
import Dropdown from "../../../components/shared/Dropdown";

const STATUS_STYLES = {
  Owner: { pill: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  Active: { pill: "bg-green-50 text-green-700", dot: "bg-green-500" },
  Inactive: { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
  Pending: { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
};

const tableStyles = {
  table: { style: { width: "100%" } },
  tableWrapper: { style: { width: "100%", height: "100%" } },
  responsiveWrapper: {
    style: { width: "100%", flex: "1 1 auto", minHeight: 0, overflowY: "auto" },
  },
  pagination: {
    style: {
      marginTop: "auto",
      flex: "0 0 auto",
      borderTop: "1px solid #E5E7EB",
    },
  },
};

const ModeratorTable = ({ moderators, setModerators }) => {
  const [viewMember, setViewMember] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [memberToEdit, setMemberToEdit] = useState(null);

  const handleUpdateMember = (formData) => {
    setModerators((prev) =>
      prev.map((member) =>
        member.id === memberToEdit?.id
          ? {
              ...member,
              name: formData.name,
              email: formData.email,
              role: formData.role,
              status: formData.status,
            }
          : member,
      ),
    );

    setMemberToEdit(null);
  };

  const handleConfirmRemove = () => {
    setModerators((prev) =>
      prev.filter((member) => member.id !== memberToRemove.id),
    );
    setMemberToRemove(null);
  };

  const columns = [
    {
      name: "Member",
      selector: (row) => row.name,
      sortable: true,
      minWidth: "240px",
      grow: 2,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar
            name={row.name}
            src={row.src}
            size={32}
            rounded="rounded-lg"
            color="#F97316"
          />
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-900">{row.name}</p>
            <p className="truncate text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      grow: 1,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      grow: 1,
      cell: (row) => {
        const { pill, dot } =
          STATUS_STYLES[row.status] ?? STATUS_STYLES.Inactive;

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
      name: "Joined",
      selector: (row) => row.joined,
      sortable: true,
      minWidth: "160px",
      grow: 1,
    },
    {
      name: "Actions",
      width: "90px",
      right: true,
      cell: (row) => (
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
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
              onClick={() => setMemberToEdit(row)}
            >
              <Pencil size={16} className="shrink-0" />
              Edit
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
              onClick={() => setViewMember(row)}
            >
              <Eye size={16} className="shrink-0" />
              View
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-2 border-t border-gray-300 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={row.status === "Owner"}
              onClick={() => setMemberToRemove(row)}
            >
              <Trash2 size={16} className="shrink-0" />
              Delete
            </button>
          </Dropdown>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="flex h-full w-full min-h-0 flex-col">
      <DataTable
        columns={columns}
        data={moderators}
        pagination
        highlightOnHover
        responsive
        fixedHeader
        fixedHeaderScrollHeight="100%"
        sortIcon={<ChevronDown size={14} />}
        customStyles={tableStyles}
        className="flex min-h-0 flex-1 flex-col"
      />

      {memberToEdit && (
        <AddEditModeratorModal
          isOpen={Boolean(memberToEdit)}
          onClose={() => setMemberToEdit(null)}
          onSubmit={handleUpdateMember}
          initialData={memberToEdit}
          mode="edit"
        />
      )}

      <ManageAccountsModal
        isOpen={Boolean(viewMember)}
        onClose={() => setViewMember(null)}
        members={viewMember ? [viewMember] : []}
        onRemove={(member) => {
          setViewMember(null);
          setMemberToRemove(member);
        }}
      />

      <DeleteModal
        isOpen={Boolean(memberToRemove)}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleConfirmRemove}
        heading="Remove Member"
        text={`Are you sure you want to remove ${
          memberToRemove?.name ?? "this member"
        }? This action cannot be undone.`}
      />
    </div>
  );
};

export default ModeratorTable;
