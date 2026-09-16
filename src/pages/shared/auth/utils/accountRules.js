// must match the backend minimum
export const PASSWORD_MIN_LENGTH = 8;

export const EMPTY_ACCOUNT = {
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export const validateAccount = ({ password, confirmPassword }) => {
  const errors = {};

  if (password.length < PASSWORD_MIN_LENGTH)
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;

  if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";

  return errors;
};
