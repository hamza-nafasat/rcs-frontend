import Button from "../shared/Button";
import ModeratorUserListItem from "../global/moderators/ModeratorUserListItem";

const ModeratorManageAccountsModal = ({
  isOpen,
  onClose,
  members = [],
  onRemove,
  heading = "Manage Accounts",
  subheading = "Remove other profiles you want ",
}) => {
  if (!isOpen) return null;
  const visibleMembers = members.filter((member) => member.role !== "Account Owner");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-150 rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{heading}</h2>
            <p className="card-subheading mt-1">{subheading}</p>
          </div>

          <span className="shrink-0 rounded-full border border-moderator bg-moderator px-3 py-1 text-sm  text-moderator">
            {visibleMembers.length}{" "}
            {visibleMembers.length === 1 ? "Member" : "Members"}
          </span>
        </div>

        {/* Members */}
        <div className="flex max-h-100 flex-col gap-3 overflow-y-auto">
          {visibleMembers.length === 0 ? (
            <p className="card-subheading py-6 text-center">
              No moderators to show.
            </p>
          ) : (
            visibleMembers.map((member) => (
              <ModeratorUserListItem
                key={member.id}
                name={member.name}
                email={member.email}
                status={member.status}
                src={member.src}
                action={
                  <button
                    type="button"
                    onClick={() => onRemove(member)}
                    className="rounded-lg px-3 py-1.5 text-sm text-remove hover:bg-red-50 cursor-pointer"
                  >
                    Remove
                  </button>
                }
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <Button type="button" onClick={onClose} className="px-4! py-2!">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModeratorManageAccountsModal;
