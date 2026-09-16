import { useEffect, useMemo, useState } from "react";
import { getCitiesOfState, getCountries, getStatesOfCountry } from "@countrystatecity/countries-browser";
import Select from "../shared/Select";

const EMPTY_LIST = [];

const loadCountries = () => getCountries();

// the key carries both codes
const loadCities = (key) => getCitiesOfState(...key.split("|"));

const toNames = (items) => [...new Set(items.map((item) => item.name))];

// stale answers and failures are ignored
const useListFor = (key, load) => {
  const [result, setResult] = useState({ key: null, items: EMPTY_LIST });

  useEffect(() => {
    if (!key) return;
    let isCurrent = true;
    load(key)
      .catch(() => EMPTY_LIST)
      .then((items) => {
        if (isCurrent) setResult({ key, items });
      });
    return () => {
      isCurrent = false;
    };
  }, [key, load]);

  const isReady = result.key === key;
  return { items: isReady ? result.items : EMPTY_LIST, isLoading: Boolean(key) && !isReady };
};

// country, then states, then cities
const LocationFields = ({ values, onChange, disabled = false, required = false, labelClassName = "" }) => {
  const countries = useListFor("all", loadCountries);
  const countryCode = countries.items.find((country) => country.name === values?.country)?.iso2;
  const states = useListFor(countryCode, getStatesOfCountry);
  const stateCode = states.items.find((state) => state.name === values?.state)?.iso2;
  const cities = useListFor(countryCode && stateCode ? `${countryCode}|${stateCode}` : null, loadCities);

  const countryNames = useMemo(() => toNames(countries.items), [countries.items]);
  const stateNames = useMemo(() => toNames(states.items), [states.items]);
  const cityNames = useMemo(() => toNames(cities.items), [cities.items]);

  const emit = (name, value) => onChange?.({ target: { name, value } });
  const toLabel = (label) => (required ? `${label} *` : label);

  // clears the fields below it
  const handleCountryChange = ({ target }) => {
    if (target.value === values?.country) return;
    emit("country", target.value);
    emit("state", "");
    emit("city", "");
  };

  const handleStateChange = ({ target }) => {
    if (target.value === values?.state) return;
    emit("state", target.value);
    emit("city", "");
  };

  return (
    <>
      <Select
        label={toLabel("Country")}
        name="country"
        value={values?.country ?? ""}
        onChange={handleCountryChange}
        options={countryNames}
        isLoading={countries.isLoading}
        placeholder="Select country"
        labelClassName={labelClassName}
        disabled={disabled}
        required={required}
        searchable
        creatable
      />
      <Select
        label={toLabel("State")}
        name="state"
        value={values?.state ?? ""}
        onChange={handleStateChange}
        options={stateNames}
        isLoading={states.isLoading}
        placeholder="Select state"
        labelClassName={labelClassName}
        disabled={disabled}
        required={required}
        searchable
        creatable
      />
      <Select
        label={toLabel("City")}
        name="city"
        value={values?.city ?? ""}
        onChange={onChange}
        options={cityNames}
        isLoading={cities.isLoading}
        placeholder="Select city"
        labelClassName={labelClassName}
        disabled={disabled}
        required={required}
        searchable
        creatable
      />
    </>
  );
};

export default LocationFields;
