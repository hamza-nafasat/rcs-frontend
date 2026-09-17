import toast from "react-hot-toast";
import Loader from "../../../components/shared/Loader";
import SettingsProfileSetting from "./components/SettingsProfileSetting";
import { USER_ROLES } from "../../../configs/constants";
import { RESTAURANT_FIELDS, PROFILE_FIELDS } from "./utils/data";
import { withMapId } from "../../../utils/mapHelpers";
import { areaPayload, franchisePayload } from "./utils/mapPayload";
import {
  useChangeMyPasswordMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "../../../store/apis/shared/auth.apis";

// the image travels with the fields
const toProfileFormData = (form, image, isClient, map) => {
  const body = new FormData();
  PROFILE_FIELDS.forEach((field) => body.append(field, form?.[field] ?? ""));
  // a blank field cannot be cleared
  if (isClient)
    RESTAURANT_FIELDS.forEach((field) => {
      if (form?.[field] !== "" && form?.[field] != null) body.append(field, form[field]);
    });

  // the map travels as json text
  if (isClient && map) {
    body.append("franchises", JSON.stringify((map?.franchises ?? []).map(franchisePayload)));
    body.append("areas", JSON.stringify((map?.areas ?? []).map(areaPayload)));
  }

  if (image) body.append("file", image);
  return body;
};

const Settings = () => {
  const { data } = useGetMyProfileQuery();
  const [updateMyProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation();
  const [changeMyPassword, { isLoading: isChangingPassword }] = useChangeMyPasswordMutation();

  const profile = data?.data;
  if (!profile) return <Loader />;

  const isClient = profile?.role === USER_ROLES.CLIENT;
  const franchises = withMapId(profile?.restaurant?.franchises ?? []);
  const areas = withMapId(profile?.restaurant?.territories ?? []);

  const handleSaveProfile = async (form, image, map) => {
    const response = await updateMyProfile(toProfileFormData(form, image, isClient, map)).unwrap();
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
          franchises={franchises}
          areas={areas}
          onSave={handleSaveProfile}
          onUpdatePassword={handleUpdatePassword}
        />
      </section>
    </article>
  );
};

export default Settings;
