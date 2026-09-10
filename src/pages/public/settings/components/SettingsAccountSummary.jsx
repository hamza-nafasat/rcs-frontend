import Avatar from "../../../../components/shared/Avatar";
import Badge from "../../../../components/shared/Badge";

const SettingsAccountSummary = ({ account }) => {
  const { name, email, role, avatar } = account;

  return (
    <article className="rounded-2xl border color-border bg-white p-5">
      <div className="flex items-center gap-4">
        <Avatar
          src={avatar}
          name={name}
          size={48}
          rounded="rounded-xl"
          color="#7C3AED"
        />

        <div className="min-w-0">
          <h2 className="card-heading truncate">{name}</h2>

          <p className="card-subheading truncate">{email}</p>

          {role && <Badge text={role} dotColor={null} className="mt-2" />}
        </div>
      </div>
    </article>
  );
};

export default SettingsAccountSummary;
