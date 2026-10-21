import AuthApplicationFields from "../../auth/components/AuthApplicationFields";

const SettingsClientApplicationDetails = ({
  form,
  onChange,
  onSelect,
  disabled = false,
}) => {

  return (
    <section>
      <AuthApplicationFields
        form={form}
        onChange={onChange}
        onSelect={onSelect}
        disabled={disabled}
      />
    </section>
  );
};

export default SettingsClientApplicationDetails;
