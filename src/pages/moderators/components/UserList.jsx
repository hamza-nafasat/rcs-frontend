import { Shield } from "lucide-react";
import UserListItem from "./UserListItem";
import Button from "../../../components/shared/Button";

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

const UserList = () => {
  return (
    <div className="flex flex-col gap-3">
      {MODERATORS.map((user) => (
        <UserListItem
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

      <Button className="px-4! py-2! self-end">Manage Accounts</Button>
    </div>
  );
};

export default UserList;
