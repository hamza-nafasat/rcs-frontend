import { useState } from "react";
import { Shield } from "lucide-react";
import ModeratorUserListItem from "./ModeratorUserListItem";
import ModeratorManageAccountsModal from "../../modals/ModeratorManageAccountsModal";
import Button from "../../shared/Button";
import DeleteModal from "../../modals/DeleteModal";

const MODERATORS = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    status: "Owner",
    meta: "Added 2 days ago",
  },
  {
    id: 2,
    name: "Marcus Lee",
    email: "marcus.lee@example.com",
    status: "Active",
    meta: "Added 1 week ago",
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    status: "Pending",
    meta: "Invited 3 days ago",
  },
  {
    id: 4,
    name: "David Okafor",
    email: "david.okafor@example.com",
    status: "Active",
    meta: "Added 1 month ago",
  },
];

const ModeratorUserList = () => {
  const [moderators, setModerators] = useState(MODERATORS);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  const handleConfirmRemove = () => {
    setModerators((prev) =>
      prev.filter((member) => member.id !== memberToRemove.id)
    );
    setMemberToRemove(null);
  };

  return (
    <section className="flex flex-col gap-3">
      {moderators.map((user) => (
        <ModeratorUserListItem
          key={user.id}
          name={user.name}
          email={user.email}
          status={user.status}
          meta={user.meta}
        />
      ))}

      <div className="mt-3 flex items-start gap-2 rounded-xl bg-info border border-muted p-3">
        <Shield size={16} className="shrink-0 text-info" />
        <p className="card-subheading text-info">
          All team members get{" "}
          <strong className="font-semibold">full read access</strong> to your
          pipeline, reports, and applicant details. Only the account owner can
          manage team members or change settings.
        </p>
      </div>

      <Button
        className="px-4! py-2! self-end"
        onClick={() => setIsManageOpen(true)}
      >
        Manage Accounts
      </Button>

      <ModeratorManageAccountsModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        members={moderators}
        onRemove={setMemberToRemove}
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
    </section>
  );
};

export default ModeratorUserList;
