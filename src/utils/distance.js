// stored in km, shown in miles
const KM_PER_MILE = 1.609344;
const SQ_KM_PER_SQ_MILE = KM_PER_MILE * KM_PER_MILE;
const ACRES_PER_SQ_MILE = 640;

export const kmToMiles = (km = 0) => km / KM_PER_MILE;

export const milesToKm = (miles = 0) => miles * KM_PER_MILE;

// at most two decimals
const round = (value) => Number(value.toFixed(2));

// e.g. 5 mi
export const formatMiles = (km = 0) => `${round(kmToMiles(km))} mi`;

// acres when under a square mile
export const formatAreaSize = (areaKm2 = 0) => {
  const sqMiles = areaKm2 / SQ_KM_PER_SQ_MILE;
  return sqMiles < 1 ? `${Math.round(sqMiles * ACRES_PER_SQ_MILE)} acres` : `${round(sqMiles)} sq mi`;
};
