import { useGetMyProfileQuery } from "../store/apis/auth.apis";

// a failed check means signed out, even if an old profile is still cached
export const useAuthUser = () => {
  const { data, isFetching, isError } = useGetMyProfileQuery();
  const user = isError ? null : data?.data;
  return { user, isChecking: !user && isFetching };
};
