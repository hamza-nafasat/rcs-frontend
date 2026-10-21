// only the fields the api accepts
const franchisePayload = ({ _id, name, country, state, city, lat, lng }) => ({
  ...(_id && { _id }),
  name,
  country,
  state,
  city,
  lat,
  lng,
});

const areaPayload = ({ _id, name, distanceKm, radiusKm, lat, lng }) => ({
  ...(_id && { _id }),
  name,
  distanceKm,
  radiusKm,
  lat,
  lng,
});

export { areaPayload, franchisePayload };
