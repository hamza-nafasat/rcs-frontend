import { Briefcase, DollarSign, MapPin, Shield, User } from "lucide-react";
import Input from "../../../../components/shared/Input";
import SegmentedControl from "../../../../components/shared/SegmentedControl";
import FormSection from "../../../../components/shared/FormSection";
import { DENSITY_OPTIONS, YES_NO_OPTIONS } from "../utils/applicationScore";

const fieldLabel =
  "uppercase text-xs font-semibold tracking-wide text-tertiary";

const AuthApplicationFields = ({
  form,
  scores,
  onChange,
  onSelect,
  disabled = false,
}) => {
  const inputClassName = disabled
    ? "bg-gray-50/50 text-gray-500 cursor-not-allowed"
    : "";

  return (
    <div className="grid grid-cols-1 items-stretch gap-4">
      {/* Applicant Information */}
      <FormSection
        icon={User}
        iconClassName="text-secondary"
        title="Applicant Information"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            name="applicantName"
            label="Applicant Name *"
            labelClassName={fieldLabel}
            placeholder="e.g. John Smith"
            value={form.applicantName}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            required
          />

          <Input
            name="companyName"
            label="Company Name"
            labelClassName={fieldLabel}
            placeholder="e.g. Smith Ventures LLC"
            value={form.companyName}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
          />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1.2fr_0.8fr]">
          <Input
            name="proposedTerritory"
            label="Proposed Territory *"
            labelClassName={fieldLabel}
            placeholder="e.g. Downtown Chicago"
            value={form.proposedTerritory}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            required
          />

          <Input
            name="city"
            label="City"
            labelClassName={fieldLabel}
            placeholder="Chicago"
            value={form.city}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
          />

          <Input
            name="state"
            label="State"
            labelClassName={fieldLabel}
            placeholder="IL"
            value={form.state}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
          />
        </div>
      </FormSection>

      {/* Financial Strength */}
      <FormSection
        icon={DollarSign}
        iconClassName="text-primary"
        title="Financial Strength (35%)"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            name="liquidCapital"
            type="number"
            min="0"
            label="Liquid Capital ($)"
            labelClassName={fieldLabel}
            placeholder="e.g. 150000"
            value={form.liquidCapital}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            hint={`Min. $75,000 - Score: ${scores.formatted.liquid}/5`}
          />

          <Input
            name="netWorth"
            type="number"
            min="0"
            label="Net Worth ($)"
            labelClassName={fieldLabel}
            placeholder="e.g. 500000"
            value={form.netWorth}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            hint={`Min. $250,000 - Score: ${scores.formatted.netWorth}/5`}
          />

          <Input
            name="creditScore"
            type="number"
            min="0"
            label="Credit Score"
            labelClassName={fieldLabel}
            placeholder="e.g. 720"
            value={form.creditScore}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            hint={`Min. 680 - Score: ${scores.formatted.credit}/5`}
          />
        </div>
      </FormSection>

      {/* Business Experience */}
      <FormSection
        icon={Briefcase}
        iconClassName="text-info"
        title="Business Experience (20%)"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            name="yearsMgmt"
            type="number"
            min="0"
            label="Years Mgmt Experience"
            labelClassName={fieldLabel}
            placeholder="e.g. 8"
            value={form.yearsMgmt}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            hint={`Score: ${scores.formatted.years}/5`}
          />

          <SegmentedControl
            label="Food/Restaurant Exp."
            value={form.foodExp}
            onChange={(value) => onSelect("foodExp", value)}
            options={YES_NO_OPTIONS}
            hint="Industry background (5.0 if Y)"
            disabled={disabled}
          />

          <SegmentedControl
            label="Multi-Unit Operator"
            value={form.multiUnit}
            onChange={(value) => onSelect("multiUnit", value)}
            options={YES_NO_OPTIONS}
            hint="Multi-unit exp. (5.0 if Y, 2.0 if N)"
            disabled={disabled}
          />
        </div>
      </FormSection>

      {/* Legal & Background */}
      <FormSection
        icon={Shield}
        iconClassName="text-secondary"
        title="Legal & Background (20%)"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SegmentedControl
            label="Bankruptcy (Past 7 Yrs)"
            labelClassName="normal-case"
            value={form.bankruptcy}
            onChange={(value) => onSelect("bankruptcy", value)}
            options={YES_NO_OPTIONS}
            hint="Disqualifying if Yes"
            hintClassName="text-remove"
            disabled={disabled}
          />

          <SegmentedControl
            label="Pending Litigation"
            labelClassName="normal-case"
            value={form.litigation}
            onChange={(value) => onSelect("litigation", value)}
            options={YES_NO_OPTIONS}
            disabled={disabled}
          />

          <SegmentedControl
            label="Criminal Background"
            labelClassName="normal-case"
            value={form.criminal}
            onChange={(value) => onSelect("criminal", value)}
            options={YES_NO_OPTIONS}
            hint="Disqualifying if Yes"
            hintClassName="text-remove"
            disabled={disabled}
          />

          <SegmentedControl
            label="Non-Compete Conflict"
            labelClassName="normal-case"
            value={form.nonCompete}
            onChange={(value) => onSelect("nonCompete", value)}
            options={YES_NO_OPTIONS}
            disabled={disabled}
          />
        </div>
      </FormSection>

      {/* Market & Location Fit */}
      <FormSection
        icon={MapPin}
        iconClassName="text-revenue"
        title="Market & Location Fit (25%)"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SegmentedControl
            label="Territory Available?"
            value={form.territoryAvailable}
            onChange={(value) => onSelect("territoryAvailable", value)}
            options={YES_NO_OPTIONS}
            disabled={disabled}
          />

          <SegmentedControl
            label="Competitive Density"
            value={form.density}
            onChange={(value) => onSelect("density", value)}
            options={DENSITY_OPTIONS}
            hint="Low=5.0 · Medium=3.0 · High=1.0"
            disabled={disabled}
          />
        </div>
      </FormSection>
    </div>
  );
};

export default AuthApplicationFields;
