// the map keys records by id
const withMapId = (records = []) => records.map((record) => ({ ...record, id: record._id }));

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

const areaPayload = ({ _id, name, distanceKm, geoPoints, areaKm2 }) => ({
  ...(_id && { _id }),
  name,
  distanceKm,
  geoPoints,
  areaKm2,
});

export { areaPayload, franchisePayload, withMapId };
