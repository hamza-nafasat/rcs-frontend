import { useGetMyProfileQuery } from "../store/apis/shared/auth.apis";

// a failed check means signed out
export const useAuthUser = () => {
  const { data, isFetching, isError } = useGetMyProfileQuery();
  const user = isError ? null : data?.data;
  return { user, isChecking: !user && isFetching };
};
