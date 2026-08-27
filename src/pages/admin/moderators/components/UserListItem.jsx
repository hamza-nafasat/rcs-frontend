import Avatar from "../../../../components/shared/Avatar";
import Badge from "../../../../components/shared/Badge";

const UserListItem = ({ name, email, status, meta, src, action }) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
      <Avatar src={src} name={name} size={40} rounded="rounded-lg" />

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="card-heading truncate">{name}</h3>
          {status && <Badge text={status} />}
        </div>
        <p className="card-subheading truncate">{email}</p>
      </div>

      {action ? (
        <div className="ml-auto shrink-0">{action}</div>
      ) : (
        meta && (
          <span className="ml-auto shrink-0 text-muted text-sm">{meta}</span>
        )
      )}
    </div>
  );
};

export default UserListItem;
