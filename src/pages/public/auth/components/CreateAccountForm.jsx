import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Crosshair,
  DollarSign,
  MapPin,
  Shield,
  User,
} from "lucide-react";
import Button from "../../../../components/shared/Button";
import Input from "../../../../components/shared/Input";
import SegmentedControl from "../../../../components/shared/SegmentedControl";
import AuthHeading from "./AuthHeading";
import ApplicationNotice from "./ApplicationNotice";
import FormSection from "./FormSection";
import {
  DENSITY_OPTIONS,
  YES_NO_OPTIONS,
  scoreApplication,
} from "../utils/applicationScore";

const INITIAL_FORM = {
  applicantName: "",
  companyName: "",
  proposedTerritory: "",
  city: "",
  state: "",
  liquidCapital: "",
  netWorth: "",
  creditScore: "",
  yearsMgmt: "",
  foodExp: "N",
  multiUnit: "N",
  bankruptcy: "N",
  litigation: "Y",
  criminal: "N",
  nonCompete: "N",
  territoryAvailable: "Y",
  density: "medium",
};

const fieldLabel =
  "uppercase text-xs font-semibold tracking-wide text-tertiary";

const CreateAccountForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [showNotice, setShowNotice] = useState(true);
  const scores = scoreApplication(form);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name) => (value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <article className="w-full rounded-2xl bg-white px-5 py-6 shadow-xs sm:px-6">
      <header>
        <AuthHeading
          heading="Create Your Account"
          subheading="Sign Up to create your RCS dashboard"
          className="mb-3"
        />
        {showNotice && (
          <ApplicationNotice onDismiss={() => setShowNotice(false)} />
        )}
      </header>

      <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormSection
          icon={User}
          iconClassName="text-secondary"
          title="Applicant Information"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              id="applicantName"
              name="applicantName"
              label="Applicant Name *"
              labelClassName={fieldLabel}
              placeholder="e.g. John Smith"
              value={form.applicantName}
              onChange={handleChange}
              required
            />
            <Input
              id="companyName"
              name="companyName"
              label="Company Name"
              labelClassName={fieldLabel}
              placeholder="e.g. Smith Ventures LLC"
              value={form.companyName}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1.2fr_0.8fr]">
            <Input
              id="proposedTerritory"
              name="proposedTerritory"
              label="Proposed Territory *"
              labelClassName={fieldLabel}
              placeholder="e.g. Downtown Chicago"
              value={form.proposedTerritory}
              onChange={handleChange}
              required
            />
            <Input
              id="city"
              name="city"
              label="City"
              labelClassName={fieldLabel}
              placeholder="Chicago"
              value={form.city}
              onChange={handleChange}
            />
            <Input
              id="state"
              name="state"
              label="State"
              labelClassName={fieldLabel}
              placeholder="IL"
              value={form.state}
              onChange={handleChange}
            />
          </div>
        </FormSection>

        <FormSection
          icon={DollarSign}
          iconClassName="text-primary"
          title="Financial Strength (35%)"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              id="liquidCapital"
              name="liquidCapital"
              type="number"
              min="0"
              label="Liquid Capital ($)"
              labelClassName={fieldLabel}
              placeholder="e.g. 150000"
              value={form.liquidCapital}
              onChange={handleChange}
              hint={`Min. $75,000 — Score: ${scores.formatted.liquid}/5`}
            />
            <Input
              id="netWorth"
              name="netWorth"
              type="number"
              min="0"
              label="Net Worth ($)"
              labelClassName={fieldLabel}
              placeholder="e.g. 500000"
              value={form.netWorth}
              onChange={handleChange}
              hint={`Min. $250,000 — Score: ${scores.formatted.netWorth}/5`}
            />
            <Input
              id="creditScore"
              name="creditScore"
              type="number"
              min="0"
              label="Credit Score"
              labelClassName={fieldLabel}
              placeholder="e.g. 720"
              value={form.creditScore}
              onChange={handleChange}
              hint={`Min. 680 — Score: ${scores.formatted.credit}/5`}
            />
          </div>
        </FormSection>

        <FormSection
          icon={Building2}
          iconClassName="text-info"
          title="Business Experience (20%)"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              id="yearsMgmt"
              name="yearsMgmt"
              type="number"
              min="0"
              label="Years Mgmt Experience"
              labelClassName={fieldLabel}
              placeholder="e.g. 8"
              value={form.yearsMgmt}
              onChange={handleChange}
              hint={`Score: ${scores.formatted.years}/5`}
            />
            <SegmentedControl
              label="Food/Restaurant Exp."
              value={form.foodExp}
              onChange={handleSelect("foodExp")}
              options={YES_NO_OPTIONS}
              hint="Industry background (5.0 if Y)"
            />
            <SegmentedControl
              label="Multi-Unit Operator"
              value={form.multiUnit}
              onChange={handleSelect("multiUnit")}
              options={YES_NO_OPTIONS}
              hint="Multi-unit exp. (5.0 if Y, 2.0 if N)"
            />
          </div>
        </FormSection>

        <FormSection
          icon={Shield}
          iconClassName="text-(--color-success)"
          title="Legal & Background (20%)"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SegmentedControl
              label="Bankruptcy (Past 7 Yrs)"
              labelClassName="normal-case"
              value={form.bankruptcy}
              onChange={handleSelect("bankruptcy")}
              options={YES_NO_OPTIONS}
              hint="Disqualifying if Yes"
              hintClassName="text-remove"
            />
            <SegmentedControl
              label="Pending Litigation"
              labelClassName="normal-case"
              value={form.litigation}
              onChange={handleSelect("litigation")}
              options={YES_NO_OPTIONS}
            />
            <SegmentedControl
              label="Criminal Background"
              labelClassName="normal-case"
              value={form.criminal}
              onChange={handleSelect("criminal")}
              options={YES_NO_OPTIONS}
              hint="Disqualifying if Yes"
              hintClassName="text-remove"
            />
            <SegmentedControl
              label="Non-Compete Conflict"
              labelClassName="normal-case"
              value={form.nonCompete}
              onChange={handleSelect("nonCompete")}
              options={YES_NO_OPTIONS}
            />
          </div>
        </FormSection>

        <FormSection
          icon={MapPin}
          iconClassName="text-revenue"
          title="Market & Location Fit (25%)"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SegmentedControl
              label="Territory Available?"
              value={form.territoryAvailable}
              onChange={handleSelect("territoryAvailable")}
              options={YES_NO_OPTIONS}
            />
            <SegmentedControl
              label="Competitive Density"
              value={form.density}
              onChange={handleSelect("density")}
              options={DENSITY_OPTIONS}
              hint="Low=5.0 · Medium=3.0 · High=1.0"
            />
          </div>
        </FormSection>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t color-border pt-4">
          <Button
            type="icon"
            onClick={() => navigate("/signin")}
            className="h-10 rounded-xl border color-border bg-white px-4 text-sm font-medium text-cancel"
          >
            Back to Login
          </Button>

          <div className="flex items-center gap-3">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-remove">
              <Crosshair size={16} />
              Score: {scores.formatted.total}
            </p>
            <Button
              type="submit"
              className="h-10 rounded-xl px-5 text-sm font-medium"
            >
              Create Account
            </Button>
          </div>
        </footer>
      </form>
    </article>
  );
};

export default CreateAccountForm;
