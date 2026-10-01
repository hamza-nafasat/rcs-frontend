import { formatPhoneNumberIntl, parsePhoneNumber } from "react-phone-number-input";

export const DEFAULT_PHONE_COUNTRY = "US";

// old numbers lack +code
export const toE164 = (value) => {
  if (!value || value.startsWith("+")) return value ?? "";
  return parsePhoneNumber(value, DEFAULT_PHONE_COUNTRY)?.number ?? "";
};

// e.g. +1 312 555 0134
export const formatPhone = (value) => formatPhoneNumberIntl(toE164(value)) || value || "";
