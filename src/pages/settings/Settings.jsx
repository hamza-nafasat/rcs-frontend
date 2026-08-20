import { useState } from "react";

import SettingsHeading from "./components/SettingsHeading";
import AccountSummary from "./components/AccountSummary";
import BusinessProfile from "./components/BusinessProfile";
import ConsultantCard from "./components/ConsultantCard";
import PasswordSecurity from "./components/PasswordSecurity";
import EmailNotifications from "./components/EmailNotifications";
import TerritoryCoverage from "./components/TerritoryCoverage";

const ACCOUNT = {
  name: "Bella Cucina",
  email: "marco@goldenfork.com",
  role: "Account Owner",
  avatar: "",
};

const PROFILE = {
  applicantName: "Marco Ricci",
  companyName: "The Golden Fork",
  email: "marco@goldenfork.com",
  phone: "",
  city: "",
  state: "",
};

const CONSULTANT = {
  name: "Sarah Chen",
  email: "sarah@rcs.com",
  phone: "+1 212-555-0101",
  avatar: "",
};

const TERRITORIES = ["Austin, TX", "Denver, CO", "Tampa, FL"];

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSaveProfile = (profile) => {
    console.log("Save profile", profile);
  };

  const handleUpdatePassword = (passwords) => {
    console.log("Update password", passwords);
  };

  const handleToggleNotifications = (enabled) => {
    setEmailNotifications(enabled);
    console.log("Email notifications", enabled);
  };

  const handleContactConsultant = (consultant) => {
    console.log("Contact consultant", consultant);
  };

  return (
    <section className="flex h-full min-h-0 flex-col">
      <header className="py-4">
        <SettingsHeading
          heading="Settings"
          subheading="Manage your account and notification preferences"
        />
      </header>

      <div className="mt-2 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Left column - identity & business details */}
        <section className="flex flex-col gap-6">
          <AccountSummary account={ACCOUNT} />

          <BusinessProfile profile={PROFILE} onSave={handleSaveProfile} />

          <ConsultantCard
            consultant={CONSULTANT}
            onContact={handleContactConsultant}
          />
        </section>

        {/* Right column - security, notifications & territories */}
        <section className="flex flex-col gap-6">
          <PasswordSecurity onUpdatePassword={handleUpdatePassword} />

          <EmailNotifications
            enabled={emailNotifications}
            onToggle={handleToggleNotifications}
          />

          <TerritoryCoverage territories={TERRITORIES} />
        </section>
      </div>
    </section>
  );
};

export default Settings;
