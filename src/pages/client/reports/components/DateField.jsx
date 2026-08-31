import { Calendar } from "lucide-react";
import Input from "../../../../components/shared/Input";

const DateField = ({ placeholder, value, onChange, name, min, max }) => {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        readOnly
        icon={<Calendar size={16} />}
      />
      <input
        type="date"
        name={name}
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        tabIndex={-1}
        aria-label={placeholder}
        onClick={(event) => {
          try {
            event.currentTarget.showPicker();
          } catch {
            /* Ignore error if showPicker is not available */
          }
        }}
        className="absolute inset-0 z-10 cursor-pointer opacity-0"
      />
    </div>
  );
};

export default DateField;
