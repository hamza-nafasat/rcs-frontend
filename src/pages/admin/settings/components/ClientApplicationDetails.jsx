import ApplicationFields from "../../../public/auth/components/ApplicationFields";
import { scoreApplication } from "../../../public/auth/utils/applicationScore";

const ClientApplicationDetails = ({
  form,
  onChange,
  onSelect,
  disabled = false,
}) => {
  const scores = scoreApplication(form);

  return (
    <section>
      <ApplicationFields
        form={form}
        scores={scores}
        onChange={onChange}
        onSelect={onSelect}
        disabled={disabled}
      />
    </section>
  );
};

export default ClientApplicationDetails;
