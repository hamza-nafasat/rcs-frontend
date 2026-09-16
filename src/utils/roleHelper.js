import { USER_ROLES } from "../configs/constants";

// a moderator uses its creator's dashboard
const getDashboardRole = (user) => (user?.role === USER_ROLES.MODERATOR ? user?.createdBy?.role : user?.role);

// work is stored under the creator
const getActingAccountId = (user) => (user?.role === USER_ROLES.MODERATOR ? user?.createdBy?._id : user?._id);

export { getActingAccountId, getDashboardRole };
