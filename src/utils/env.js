const config = {
  VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL,
};

const getEnv = (key) => {
  const value = config[key];
  if (value === undefined) throw new Error(`Environment variable ${key} is not defined`);

  return value;
};

export { getEnv };
