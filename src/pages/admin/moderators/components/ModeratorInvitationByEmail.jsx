import { Users } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Button from "../../../../components/shared/Button";

const ModeratorInvitationByEmail = () => {
  return (
    <div className="rounded-xl border color-border bg-active p-4">
      <h2 className="card-heading">INVITE BY EMAIL</h2>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Full Name (optional)" />
        <Input type="email" placeholder="colleague@example.com" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-muted">
          They will receive a link to access your pipeline dashboard.
        </p>

        <Button
          icon={<Users size={14} />}
          iconPosition="left"
          className="px-4! py-2!"
        >
          Send Invite
        </Button>
      </div>
    </div>
  );
};

export default ModeratorInvitationByEmail;
