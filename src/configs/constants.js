const USER_ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
  USER: "user",
};

const USER_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  INVITED: "invited",
};

const ROLE_HOME = {
  [USER_ROLES.ADMIN]: "/admin/dashboard",
  [USER_ROLES.CLIENT]: "/client/dashboard",
  [USER_ROLES.USER]: "/user/dashboard",
};

export { ROLE_HOME, USER_ROLES, USER_STATUSES };
