import { USER_ROLES } from "../configs/constants";

// a moderator works inside the dashboard of the account that created them
const getDashboardRole = (user) => (user?.role === USER_ROLES.MODERATOR ? user?.createdBy?.role : user?.role);

export { getDashboardRole };
