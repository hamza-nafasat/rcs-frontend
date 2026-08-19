import SettingsHeading from "./components/SettingsHeading";
import CompanyInformation from "./components/CompanyInformation";
import SecuritySettings from "./components/SecuritySettings";

const Settings = () => {
  const handleSaveCompany = (company) => {
    console.log("Save company", company);
  };

  const handleChangePassword = (passwords) => {
    console.log("Change password", passwords);
  };

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="border-b color-border py-4">
        <SettingsHeading
          heading="Settings"
          subheading="Manage your company information and account security."
        />
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <CompanyInformation onSave={handleSaveCompany} />

        <SecuritySettings onChangePassword={handleChangePassword} />
      </div>
    </section>
  );
};

export default Settings;
