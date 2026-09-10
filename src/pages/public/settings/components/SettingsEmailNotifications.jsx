import Toggle from "../../../../components/shared/Toggle";
import SettingsCardHeading from "./SettingsCardHeading";

const SettingsEmailNotifications = ({ enabled, onToggle }) => {
  return (
    <article className="flex items-center justify-between gap-4 rounded-2xl border color-border bg-white p-5">
      <SettingsCardHeading
        heading="Email Notifications"
        subheading="Choose if you want to get email notifications"
      />

      <Toggle
        checked={enabled}
        onChange={onToggle}
        label="Email notifications"
      />
    </article>
  );
};

export default SettingsEmailNotifications;
