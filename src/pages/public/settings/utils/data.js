import { EMPTY_APPLICATION } from "../../auth/utils/applicationScore";

export const DUMMY_PROFILE = {
  firstName: "Marco",
  lastName: "Ricci",
  email: "marco@goldenfork.com",
  phone: "+1 (555) 000-0000",
  role: { displayName: "Account Owner" },
  address: "123 Market Street",
  city: "Austin",
  state: "TX",
  postalCode: "78701",
  country: "United States",
  teamSize: 12,
  url: "",
  imagePreview: "",
};

export const DUMMY_APPLICATION = {
  ...EMPTY_APPLICATION,
  applicantName: "Marco Ricci",
  companyName: "Golden Fork",
  proposedTerritory: "Austin Metro",
  city: "Austin",
  state: "TX",
  liquidCapital: "150000",
  netWorth: "500000",
  creditScore: "720",
  yearsMgmt: "8",
  foodExp: "Y",
  multiUnit: "N",
  bankruptcy: "N",
  litigation: "N",
  criminal: "N",
  nonCompete: "N",
  territoryAvailable: "Y",
  density: "medium",
};
