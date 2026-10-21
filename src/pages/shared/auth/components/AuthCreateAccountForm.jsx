import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/shared/Button";
import AuthHeading from "./AuthHeading";
import AuthApplicationFields from "./AuthApplicationFields";
import MapLocationAssign from "../../../../components/global/map/MapLocationAssign";
import { EMPTY_ACCOUNT, validateAccount } from "../utils/accountRules";
import { EMPTY_APPLICATION } from "../utils/applicationScore";
import { useAcceptInviteMutation } from "../../../../store/apis/shared/auth.apis";
import { ROLE_HOME } from "../../../../configs/constants";

// the invite prefills these fields
const AuthCreateAccountForm = ({ inviteToken, invite }) => {
  const navigate = useNavigate();
  const [acceptInvite, { isLoading }] = useAcceptInviteMutation();
  const [account, setAccount] = useState({ ...EMPTY_ACCOUNT, email: invite?.email ?? "" });
  const [form, setForm] = useState({
    ...EMPTY_APPLICATION,
    firstName: invite?.firstName ?? "",
    lastName: invite?.lastName ?? "",
    restaurantName: invite?.restaurantName ?? "",
  });
  const [accountErrors, setAccountErrors] = useState({});
  const [map, setMap] = useState({ franchises: [], areas: [] });

  const handleAccountChange = (event) => {
    const { name, value } = event.target;
    setAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateAccount(account);
    setAccountErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const response = await acceptInvite({
        inviteToken,
        ...form,
        phone: account.phone,
        password: account.password,
        franchises: map.franchises,
        areas: map.areas,
      }).unwrap();
      navigate(ROLE_HOME[response?.data?.role] ?? "/");
    } catch (error) {
      console.error("Accept invite error:", error);
    }
  };

  return (
    <article className="w-full rounded-2xl bg-white px-5 py-6 shadow-xs sm:px-6">
      <AuthHeading
        heading={invite?.restaurantName ? `Welcome, ${invite.restaurantName}` : "Welcome to RCS"}
        subheading="Set up your account and tell us about your restaurant. It takes about five minutes."
        className="mb-0"
      />

      <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
        <AuthApplicationFields
          form={form}
          onChange={handleChange}
          onSelect={handleSelect}
          account={account}
          accountErrors={accountErrors}
          onAccountChange={handleAccountChange}
        />

        {/* Franchises and territory areas */}
        <MapLocationAssign franchises={map.franchises} areas={map.areas} onChange={setMap} />

        <footer className="flex flex-col gap-3 border-t color-border pt-4">
          <p className="text-xs leading-relaxed text-secondary">
            By creating your account you confirm the details above are true to the best of your knowledge.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="bare"
              onClick={() => navigate("/signin")}
              className="h-10 w-full rounded-xl border color-border bg-white px-4 text-sm font-medium text-cancel sm:w-auto"
            >
              Back to Login
            </Button>

            <Button
              type="submit"
              isLoading={isLoading}
              className="h-10 w-full rounded-xl px-5 text-sm font-medium sm:w-auto"
            >
              Create My Account
            </Button>
          </div>
        </footer>
      </form>
    </article>
  );
};

export default AuthCreateAccountForm;
