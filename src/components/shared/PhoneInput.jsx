import { useEffect, useRef, useState } from "react";
import PhoneNumberInput, { getCountryCallingCode, isValidPhoneNumber } from "react-phone-number-input";
import COUNTRY_NAMES from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";
import { DEFAULT_PHONE_COUNTRY, toE164 } from "../../utils/formatPhone";

const PhoneInput = ({
  label,
  name = "phone",
  value,
  onChange,
  placeholder = "Enter phone number",
  required = false,
  disabled = false,
  className = "",
  labelClassName = "",
}) => {
  const inputRef = useRef(null);
  const [country, setCountry] = useState(DEFAULT_PHONE_COUNTRY);
  const phone = toE164(value);

  // only the code typed so far
  const hasDigits = Boolean(phone) && (!country || phone !== `+${getCountryCallingCode(country)}`);
  const isInvalid = hasDigits && !isValidPhoneNumber(phone);
  const error = isInvalid ? `Invalid phone number for ${COUNTRY_NAMES[country] ?? "this country"}` : "";

  // blocks the form submit
  useEffect(() => {
    inputRef.current?.setCustomValidity(error);
  }, [error]);

  return (
    <section className="w-full">
      {label && <label className={`mb-1 block text-sm font-medium text-tertiary ${labelClassName}`}>{label}</label>}

      <PhoneNumberInput
        ref={inputRef}
        international
        limitMaxLength
        countryCallingCodeEditable={false}
        defaultCountry={DEFAULT_PHONE_COUNTRY}
        onCountryChange={setCountry}
        name={name}
        value={phone}
        onChange={(next) => onChange?.({ target: { name, value: next ?? "" } })}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`h-10 w-full rounded-xl border bg-white px-4 text-sm focus-within:border-primary ${
          isInvalid ? "border-red-400" : "border-[#E5E7EB]"
        } ${className}`}
        numberInputProps={{ className: "h-full min-w-0 flex-1 bg-transparent outline-none" }}
      />

      {isInvalid && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </section>
  );
};

export default PhoneInput;
