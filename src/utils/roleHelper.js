import { USER_ROLES } from "../configs/constants";

// a moderator works inside the dashboard of the account that created them
const getDashboardRole = (user) => (user?.role === USER_ROLES.MODERATOR ? user?.createdBy?.role : user?.role);

// a moderator acts on the account that created them, so their work is stored under it
const getActingAccountId = (user) => (user?.role === USER_ROLES.MODERATOR ? user?.createdBy?._id : user?._id);

export { getActingAccountId, getDashboardRole };
