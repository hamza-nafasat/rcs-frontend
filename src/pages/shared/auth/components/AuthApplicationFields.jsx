import { useState } from "react";
import { Briefcase, DollarSign, MapPin, Shield, User, Utensils } from "lucide-react";
import Input from "../../../../components/shared/Input";
import SegmentedControl from "../../../../components/shared/SegmentedControl";
import FormSection from "../../../../components/shared/FormSection";
import LocationFields from "../../../../components/global/LocationFields";
import PhoneInput from "../../../../components/shared/PhoneInput";
import { CLIENT_STATUS_OPTIONS, DENSITY_OPTIONS, YES_NO_OPTIONS } from "../utils/applicationScore";
import { PASSWORD_MIN_LENGTH } from "../utils/accountRules";

const fieldLabel = "uppercase text-xs font-semibold tracking-wide text-tertiary";

// the plain answers behind each info icon
const SECTION_INFO = {
  restaurant: {
    summary:
      "This is the brand you are bringing to RCS. The name you type here shows on your dashboard and on every document we prepare for you.",
    points: [
      { label: "Restaurant name", text: "The name your customers know. Not your company registration name." },
      { label: "Main cuisine", text: "The food you are best known for. One or two words is enough." },
      {
        label: "Health score",
        text: "Your most recent food hygiene rating out of 100. You will find it on your last inspection report.",
      },
      {
        label: "How the business is doing",
        text: "Your own honest view. Saying business is slow will not count against you. It just tells us where to help first.",
      },
    ],
  },

  finances: {
    summary:
      "A franchise costs money before it earns any. These numbers tell us the plan is affordable for you. We do not want anyone signing up for something that puts them under.",
    points: [
      {
        label: "Cash available",
        text: "Money you could put in today without selling anything or borrowing. Savings and current accounts count.",
      },
      {
        label: "Net worth",
        text: "Add up everything you own, such as property, vehicles, savings and investments. Then take away everything you owe.",
      },
      {
        label: "Credit score",
        text: "The number on your credit report. Lenders use it to set your interest rate. Most banks let you check it for free.",
      },
    ],
    footnote: "Only our review team sees these numbers. We never show them to other clients or applicants.",
  },

  experience: {
    summary:
      "This is about what you have run before. You do not need any experience. Plenty of people start with none. It just helps us plan how much training and support to give you.",
    points: [
      {
        label: "Years managing a business",
        text: "Any kind of business counts, not just restaurants. Round to the nearest year.",
      },
      { label: "Worked in food before", text: "Any job in a restaurant, cafe, bar or catering counts. Any level is fine." },
      {
        label: "Run more than one site",
        text: "This asks if you have managed two or more places at the same time. Running several places is a different job from running one.",
      },
    ],
  },

  legal: {
    summary:
      "The law says we have to ask everyone these four questions. Please answer honestly. Saying yes rarely stops an application on its own. Something we find out later usually does.",
    points: [
      {
        label: "Bankruptcy in the last 7 years",
        text: "This can be personal or business. We have to tell the lenders who fund franchise deals.",
      },
      { label: "Open court case", text: "Any legal dispute that is still going on, business or personal." },
      {
        label: "Criminal convictions",
        text: "Only convictions that are still on your record. You do not need to declare spent ones.",
      },
      {
        label: "Tied to a competitor",
        text: "A clause in an old job or franchise contract that might stop you running this one.",
      },
    ],
    footnote:
      "If you are not sure about any of these, answer yes and tell us the details later. We would rather talk it through with you.",
  },

  market: {
    summary:
      "This is about how busy your area already is. Your answers shape which territory we can protect for you and how far apart your branches need to be.",
    points: [
      {
        label: "Is the territory still free",
        text: "As far as you know, has another franchise already taken the area you want? A rough guess is fine. We check properly before anything is agreed.",
      },
      {
        label: "How many rivals are nearby",
        text: "Low means there are few restaurants like yours close by. High means a crowded market. Think about restaurants like yours, not every food business.",
      },
    ],
  },
};

const AuthApplicationFields = ({ form, onChange, onSelect, disabled = false, account = null, accountErrors = {}, onAccountChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputClassName = disabled ? "bg-gray-50/50 text-gray-500 cursor-not-allowed" : "";

  return (
    <div className="grid grid-cols-1 items-stretch gap-4">
      {/* Who you are */}
      <FormSection
        icon={User}
        iconClassName="text-secondary"
        title="About You"
        description="Who we will be dealing with day to day."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            name="firstName"
            label="First Name *"
            labelClassName={fieldLabel}
            placeholder="e.g. John"
            value={form.firstName}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            required
          />

          <Input
            name="lastName"
            label="Last Name *"
            labelClassName={fieldLabel}
            placeholder="e.g. Smith"
            value={form.lastName}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            required
          />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <LocationFields values={form} onChange={onChange} disabled={disabled} labelClassName={fieldLabel} required />
        </div>

        {/* only the signup form passes an account */}
        {account && (
          <>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                name="email"
                label="Email"
                labelClassName={fieldLabel}
                value={account.email}
                disabled
                className="bg-gray-50/50 text-gray-500 cursor-not-allowed"
                hint="You will sign in with this"
              />

              <PhoneInput
                label="Phone *"
                labelClassName={fieldLabel}
                value={account.phone}
                onChange={onAccountChange}
                required
              />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                name="password"
                label="Password *"
                labelClassName={fieldLabel}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={account.password}
                onChange={onAccountChange}
                isEyeButton
                showConfirm={showPassword}
                setShowConfirm={setShowPassword}
                hint={accountErrors.password ?? `At least ${PASSWORD_MIN_LENGTH} characters`}
                hintClassName={accountErrors.password ? "text-remove" : ""}
                required
              />

              <Input
                name="confirmPassword"
                label="Confirm Password *"
                labelClassName={fieldLabel}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={account.confirmPassword}
                onChange={onAccountChange}
                isEyeButton
                showConfirm={showConfirmPassword}
                setShowConfirm={setShowConfirmPassword}
                hint={accountErrors.confirmPassword ?? "Type it once more"}
                hintClassName={accountErrors.confirmPassword ? "text-remove" : ""}
                required
              />
            </div>
          </>
        )}
      </FormSection>

      {/* The restaurant itself */}
      <FormSection
        icon={Utensils}
        iconClassName="text-info"
        title="Your Restaurant"
        description="The brand you are bringing to RCS."
        info={SECTION_INFO.restaurant}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            name="restaurantName"
            label="Restaurant Name *"
            labelClassName={fieldLabel}
            placeholder="e.g. The Harbor Kitchen"
            value={form.restaurantName}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            hint="The name customers know"
            required
          />

          <Input
            name="restaurantCuisine"
            label="Main Cuisine *"
            labelClassName={fieldLabel}
            placeholder="e.g. Italian"
            value={form.restaurantCuisine}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            hint="What you are known for"
            required
          />

          <Input
            name="healthScore"
            type="number"
            min="0"
            max="100"
            label="Health Score *"
            labelClassName={fieldLabel}
            placeholder="0 - 100"
            value={form.healthScore}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            hint="Your latest hygiene rating"
            required
          />
        </div>

        <SegmentedControl
          label="How is the business doing?"
          labelClassName="normal-case"
          value={form.status}
          onChange={(value) => onSelect("status", value)}
          options={CLIENT_STATUS_OPTIONS}
          hint="Your own honest view"
          disabled={disabled}
          className="mt-3"
        />
      </FormSection>

      {/* Money behind the business */}
      <FormSection
        icon={DollarSign}
        iconClassName="text-primary"
        title="Your Finances"
        description="Whether the plan is affordable for you."
        info={SECTION_INFO.finances}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            name="liquidCapital"
            type="number"
            min="0"
            label="Cash Available ($) *"
            labelClassName={fieldLabel}
            placeholder="e.g. 150000"
            value={form.liquidCapital}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            hint="Money you could use today"
            required
          />

          <Input
            name="netWorth"
            type="number"
            min="0"
            label="Net Worth ($) *"
            labelClassName={fieldLabel}
            placeholder="e.g. 500000"
            value={form.netWorth}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            hint="What you own, minus what you owe"
            required
          />

          <Input
            name="creditScore"
            type="number"
            min="0"
            label="Credit Score *"
            labelClassName={fieldLabel}
            placeholder="e.g. 720"
            value={form.creditScore}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            hint="From your credit report"
            required
          />
        </div>
      </FormSection>

      {/* What they have run before */}
      <FormSection
        icon={Briefcase}
        iconClassName="text-info"
        title="Your Experience"
        description="What you have run before. None is fine."
        info={SECTION_INFO.experience}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            name="yearsMgmt"
            type="number"
            min="0"
            label="Years Managing *"
            labelClassName={fieldLabel}
            placeholder="e.g. 8"
            value={form.yearsMgmt}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
            hint="Any business, not only food"
            required
          />

          <SegmentedControl
            label="Worked in food before?"
            labelClassName="normal-case"
            value={form.foodExp}
            onChange={(value) => onSelect("foodExp", value)}
            options={YES_NO_OPTIONS}
            hint="Any role counts"
            disabled={disabled}
          />

          <SegmentedControl
            label="Run more than one site?"
            labelClassName="normal-case"
            value={form.multiUnit}
            onChange={(value) => onSelect("multiUnit", value)}
            options={YES_NO_OPTIONS}
            hint="Two or more at once"
            disabled={disabled}
          />
        </div>
      </FormSection>

      {/* Things that could block the deal */}
      <FormSection
        icon={Shield}
        iconClassName="text-secondary"
        title="Legal Background"
        description="Four questions the law requires us to ask."
        info={SECTION_INFO.legal}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SegmentedControl
            label="Bankruptcy in the last 7 years?"
            labelClassName="normal-case"
            value={form.bankruptcy}
            onChange={(value) => onSelect("bankruptcy", value)}
            options={YES_NO_OPTIONS}
            disabled={disabled}
          />

          <SegmentedControl
            label="Any court case open against you?"
            labelClassName="normal-case"
            value={form.litigation}
            onChange={(value) => onSelect("litigation", value)}
            options={YES_NO_OPTIONS}
            disabled={disabled}
          />

          <SegmentedControl
            label="Any criminal convictions?"
            labelClassName="normal-case"
            value={form.criminal}
            onChange={(value) => onSelect("criminal", value)}
            options={YES_NO_OPTIONS}
            disabled={disabled}
          />

          <SegmentedControl
            label="Tied to a competitor by contract?"
            labelClassName="normal-case"
            value={form.nonCompete}
            onChange={(value) => onSelect("nonCompete", value)}
            options={YES_NO_OPTIONS}
            disabled={disabled}
          />
        </div>
      </FormSection>

      {/* Where they want to trade */}
      <FormSection
        icon={MapPin}
        iconClassName="text-revenue"
        title="Your Market"
        description="How crowded your area already is."
        info={SECTION_INFO.market}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SegmentedControl
            label="Is the territory you want still free?"
            labelClassName="normal-case"
            value={form.territoryAvailable}
            onChange={(value) => onSelect("territoryAvailable", value)}
            options={YES_NO_OPTIONS}
            hint="An honest guess is fine"
            disabled={disabled}
          />

          <SegmentedControl
            label="How many rivals are nearby?"
            labelClassName="normal-case"
            value={form.density}
            onChange={(value) => onSelect("density", value)}
            options={DENSITY_OPTIONS}
            hint="Restaurants like yours"
            disabled={disabled}
          />
        </div>
      </FormSection>
    </div>
  );
};

export default AuthApplicationFields;
