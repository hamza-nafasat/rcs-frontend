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
  NOTIFICATION_NEW: "notification:new",
};

// what the messages module listens to
const MESSAGE_EVENTS = [
  SOCKET_EVENTS.MESSAGE_NEW,
  SOCKET_EVENTS.MESSAGE_DELETED,
  SOCKET_EVENTS.MESSAGES_READ,
  SOCKET_EVENTS.CONVERSATION_UPDATED,
];

const ROLE_HOME = {
  [USER_ROLES.ADMIN]: "/admin/dashboard",
  [USER_ROLES.CLIENT]: "/client/dashboard",
  [USER_ROLES.USER]: "/user/dashboard",
};

export { MESSAGE_EVENTS, ROLE_HOME, SOCKET_EVENTS, USER_ROLES, USER_STATUSES };
