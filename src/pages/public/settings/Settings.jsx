import SettingsProfileSetting from "./components/SettingsProfileSetting";

const Settings = ({ type = "admin" }) => {
  // TODO: persist profile + password changes once the settings API lands
  const handleSaveProfile = () => {};

  const handleUpdatePassword = () => {};

  return (
    <article className="flex h-full min-h-0 flex-col">
      <section>
        <SettingsProfileSetting
          type={type}
          onSave={handleSaveProfile}
          onUpdatePassword={handleUpdatePassword}
        />
      </section>
    </article>
  );
};

export default Settings;
