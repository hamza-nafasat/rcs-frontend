import toast from "react-hot-toast";
import Loader from "../../../components/shared/Loader";
import SettingsProfileSetting from "./components/SettingsProfileSetting";
import { USER_ROLES } from "../../../configs/constants";
import { CLIENT_FIELDS, PROFILE_FIELDS } from "./utils/data";
import {
  useChangeMyPasswordMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "../../../store/apis/shared/auth.apis";

// multipart so the image travels with the fields, blank fields are left out
const toProfileFormData = (form, image, isClient) => {
  const body = new FormData();
  const fields = isClient ? [...PROFILE_FIELDS, ...CLIENT_FIELDS] : PROFILE_FIELDS;
  fields.forEach((field) => {
    if (form?.[field] !== "" && form?.[field] != null) body.append(field, form[field]);
  });
  if (image) body.append("file", image);
  return body;
};

const Settings = () => {
  const { data } = useGetMyProfileQuery();
  const [updateMyProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation();
  const [changeMyPassword, { isLoading: isChangingPassword }] = useChangeMyPasswordMutation();
  const profile = data?.data;

  if (!profile) return <Loader />;

  // a moderator edits only their own account, never the restaurant
  const isClient = profile?.role === USER_ROLES.CLIENT;

  const handleSaveProfile = async (form, image) => {
    const response = await updateMyProfile(toProfileFormData(form, image, isClient)).unwrap();
    toast.success(response?.message);
  };

  const handleUpdatePassword = async ({ currentPassword, newPassword }) => {
    const response = await changeMyPassword({ currentPassword, newPassword }).unwrap();
    toast.success(response?.message);
  };

  return (
    <article className="flex h-full min-h-0 flex-col">
      <section>
        <SettingsProfileSetting
          profile={profile}
          isClient={isClient}
          isSaving={isSaving}
          isChangingPassword={isChangingPassword}
          onSave={handleSaveProfile}
          onUpdatePassword={handleUpdatePassword}
        />
      </section>
    </article>
  );
};

export default Settings;
