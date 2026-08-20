import Avatar from "../../../components/shared/Avatar";
import Button from "../../../components/shared/Button";
import CardHeading from "./CardHeading";

const ConsultantCard = ({ consultant, onContact }) => {
  const { name, email, phone, avatar } = consultant;

  return (
    <article className="rounded-2xl border color-border bg-white p-5">
      <CardHeading heading="Your RCS Consultant" />

      <div className="mt-5 flex items-center gap-3 rounded-xl border color-border p-4">
        <Avatar src={avatar} name={name} size={36} color="#FED7AA" className="text-[#C2410C]!" />

        <div className="min-w-0 flex-1">
          <p className="text-subject truncate">{name}</p>

          <p className="card-subheading truncate">
            {email}
            {phone && ` · ${phone}`}
          </p>
        </div>

        <Button
          type="icon"
          onClick={() => onContact?.(consultant)}
          className="bg-primary primary px-4! py-2! text-sm"
        >
          Contact
        </Button>
      </div>
    </article>
  );
};

export default ConsultantCard;
