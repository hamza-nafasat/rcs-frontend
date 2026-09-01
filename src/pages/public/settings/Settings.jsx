import ProfileSetting from "./components/ProfileSetting";

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
        <ProfileSetting
          type={type}
          onSave={handleSaveProfile}
          onUpdatePassword={handleUpdatePassword}
        />
      </section>
    </article>
  );
};

export default Settings;
