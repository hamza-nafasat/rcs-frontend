import SettingsProfileSetting from "./components/SettingsProfileSetting";

const Settings = ({ type = "admin" }) => {
  const handleSaveProfile = (profile) => {
    console.log("Save profile", profile);
  };

  const handleUpdatePassword = (passwords) => {
    console.log("Update password", passwords);
  };

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
