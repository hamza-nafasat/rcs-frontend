import { EMPTY_APPLICATION } from "../../auth/utils/applicationScore";

// what every account edits about itself
export const PROFILE_FIELDS = [
  "firstName",
  "lastName",
  "phone",
  "address",
  "city",
  "state",
  "country",
  "isEmailNotificationEnabled",
];

// what only a client edits
export const RESTAURANT_FIELDS = [
  "restaurantName",
  "restaurantCuisine",
  "status",
  "healthScore",
  "territoryAvailable",
  "density",
  "liquidCapital",
  "netWorth",
  "creditScore",
  "yearsMgmt",
  "foodExp",
  "multiUnit",
  "bankruptcy",
  "litigation",
  "criminal",
  "nonCompete",
];

export const PERSONAL_INPUTS = [
  { label: "First Name", name: "firstName", isRequired: true },
  { label: "Last Name", name: "lastName", isRequired: true },
  { label: "Email", name: "email", type: "email", isLocked: true },
  { label: "Phone Number", name: "phone", type: "tel" },
  { label: "Address", name: "address", isWide: true },
];

export const PASSWORD_INPUTS = [
  { name: "currentPassword", label: "Current Password", placeholder: "Enter current password" },
  { name: "newPassword", label: "New Password", placeholder: "Enter new password" },
  { name: "confirmPassword", label: "Confirm New Password", placeholder: "Confirm new password" },
];

export const EMPTY_PASSWORDS = { currentPassword: "", newPassword: "", confirmPassword: "" };

export const EMPTY_PROFILE = {
  ...EMPTY_APPLICATION,
  email: "",
  phone: "",
  address: "",
  country: "",
  isEmailNotificationEnabled: true,
};
