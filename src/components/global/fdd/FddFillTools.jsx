import { CalendarDays, Signature, Type } from "lucide-react";
import Button from "../../shared/Button";
import Input from "../../shared/Input";
import SignatureCreator from "./SignatureCreator";

const FILL_TOOLS = [
  { value: "signature", label: "Signature", hint: "Sign the document", icon: Signature },
  { value: "text", label: "Text", hint: "A date, name or note", icon: Type },
];

const TOOL_CARD = "flex-1 rounded-xl border px-3! py-3! text-center transition";
const TOOL_CARD_TEXT = "flex w-full flex-col items-center gap-1";
const ACTIVE_TOOL_CARD = "border-primary bg-moderator text-primary";
const IDLE_TOOL_CARD = "color-border bg-white text-secondary hover:bg-muted";

const todayText = () => new Date().toLocaleDateString();

// what gets dropped on a page: a signature image, or a line of text such as a date or a name
const FddFillTools = ({
  activeTool,
  onToolChange,
  signature,
  onCreateSignature,
  onResetSignature,
  text,
  onTextChange,
  placementCount = 0,
}) => {
  return (
    <section className="flex flex-col gap-4">
      {/* What to add */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Add to document</p>

        <div className="flex gap-2">
          {FILL_TOOLS.map(({ value, label, hint, icon: Icon }) => (
            <Button
              key={value}
              variant="bare"
              onClick={() => onToolChange(value)}
              aria-pressed={activeTool === value}
              textClassName={TOOL_CARD_TEXT}
              className={`${TOOL_CARD} ${activeTool === value ? ACTIVE_TOOL_CARD : IDLE_TOOL_CARD}`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs text-muted">{hint}</span>
            </Button>
          ))}
        </div>
      </div>

      {activeTool === "signature" ? (
        signature ? (
          <>
            <img
              src={signature}
              alt="Your signature"
              draggable={false}
              className="h-24 w-full rounded-xl border color-border bg-muted object-contain p-2"
            />

            <Button
              variant="bare"
              onClick={onResetSignature}
              className="rounded-xl border color-border bg-white px-3! py-2! text-sm text-cancel"
            >
              Draw a different one
            </Button>
          </>
        ) : (
          <SignatureCreator onCreate={onCreateSignature} />
        )
      ) : (
        <>
          <Input
            label="Text to add"
            name="fillText"
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            placeholder="A date, a name, a note"
          />

          <Button
            variant="bare"
            onClick={() => onTextChange(todayText())}
            icon={<CalendarDays size={14} />}
            className="rounded-xl border color-border bg-white px-3! py-2! text-sm text-secondary"
          >
            Use today's date
          </Button>
        </>
      )}

      <p className="text-xs text-muted">
        {placementCount === 0
          ? "Click a page to place it."
          : `Placed on ${placementCount} spot${placementCount > 1 ? "s" : ""}.`}
      </p>
    </section>
  );
};

export default FddFillTools;
