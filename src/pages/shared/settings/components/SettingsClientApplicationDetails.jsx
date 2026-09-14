import AuthApplicationFields from "../../auth/components/AuthApplicationFields";
import { scoreApplication } from "../../auth/utils/applicationScore";

const SettingsClientApplicationDetails = ({
  form,
  onChange,
  onSelect,
  disabled = false,
}) => {
  const scores = scoreApplication(form);

  return (
    <section>
      <AuthApplicationFields
        form={form}
        scores={scores}
        onChange={onChange}
        onSelect={onSelect}
        disabled={disabled}
      />
    </section>
  );
};

export default SettingsClientApplicationDetails;
