const USER_ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
  USER: "user",
  MODERATOR: "moderator",
};

const USER_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  INVITED: "invited",
};

// names both sides listen on
const SOCKET_EVENTS = {
  MESSAGE_NEW: "message:new",
  MESSAGE_DELETED: "message:deleted",
  MESSAGES_READ: "messages:read",
  CONVERSATION_UPDATED: "conversation:updated",
};

const ROLE_HOME = {
  [USER_ROLES.ADMIN]: "/admin/dashboard",
  [USER_ROLES.CLIENT]: "/client/dashboard",
  [USER_ROLES.USER]: "/user/dashboard",
};

export { ROLE_HOME, SOCKET_EVENTS, USER_ROLES, USER_STATUSES };
