// import SettingsHeading from "./components/SettingsHeading";
import ProfileSetting from "./components/ProfileSetting";

const Settings = () => {
  const handleSaveProfile = (profile) => {
    console.log("Save profile", profile);
  };

  const handleUpdatePassword = (passwords) => {
    console.log("Update password", passwords);
  };

  return (
    <article className="flex h-full min-h-0 flex-col">
      {/* <section className="py-4">
        <SettingsHeading
          heading="Settings"
          subheading="Manage your account and notification preferences"
        />
      </section> */}
      <section>
        <ProfileSetting
          onSave={handleSaveProfile}
          onUpdatePassword={handleUpdatePassword}
        />
      </section>
    </article>
  );
};

export default Settings;
