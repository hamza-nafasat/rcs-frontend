import { Map, X } from "lucide-react";
import AuthApplicationFields from "../../auth/components/AuthApplicationFields";
import FormSection from "../../../../components/shared/FormSection";
import Select from "../../../../components/shared/Select";
import { US_STATES } from "../../../../utils/fddStateHelper";

const STATE_OPTIONS = US_STATES.map((state) => state.name);

// what the info icon explains
const STATES_INFO = {
  summary:
    "These are the states you are open for business in. We only accept franchise applications from the states listed here.",
  points: [
    {
      label: "Why it matters",
      text: "Someone applying from a state that is not on this list is turned down automatically and told we are not there yet.",
    },
    {
      label: "Your documents",
      text: "Every state here needs a Franchise Disclosure Document before an applicant can sign anything.",
    },
    {
      label: "States you cannot remove",
      text: "If you already have a branch in a state, it stays on the list. Remove the branch from the map first.",
    },
  ],
  footnote: "Adding a state here does not commit you to anything. It only opens that state up to applications.",
};

const SettingsClientApplicationDetails = ({ form, onChange, onSelect, disabled = false }) => {
  const states = form?.restaurantStates ?? [];

  // the select speaks the same event shape
  const removeState = (state) =>
    onChange({ target: { name: "restaurantStates", value: states.filter((item) => item !== state) } });

  return (
    <section className="flex flex-col gap-4">
      <FormSection
        icon={Map}
        iconClassName="text-revenue"
        title="States You Operate In"
        description="Where you accept franchise applications from."
        info={STATES_INFO}
      >
        <Select
          label={`Operating States (${states.length})`}
          name="restaurantStates"
          value={states}
          onChange={onChange}
          options={STATE_OPTIONS}
          placeholder="Select the states you trade in"
          disabled={disabled}
          multiple
          searchable
          clearable
        />

        {/* the trigger only counts them, so list them here */}
        {states.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {states.map((state) => (
              <span
                key={state}
                className="inline-flex items-center gap-1 rounded-full bg-moderator py-1 pl-3 pr-1.5 text-xs font-medium text-primary"
              >
                {state}

                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeState(state)}
                    aria-label={`Remove ${state}`}
                    className="cursor-pointer rounded-full p-0.5 transition hover:bg-white/70"
                  >
                    <X size={12} />
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2.5 text-xs text-remove">
            No states selected yet. Applications from every state will be turned down.
          </p>
        )}
      </FormSection>

      <AuthApplicationFields form={form} onChange={onChange} onSelect={onSelect} disabled={disabled} />
    </section>
  );
};

export default SettingsClientApplicationDetails;
