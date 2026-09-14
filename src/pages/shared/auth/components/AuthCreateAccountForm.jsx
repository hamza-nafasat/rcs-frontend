import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crosshair } from "lucide-react";
import Button from "../../../../components/shared/Button";
import AuthHeading from "./AuthHeading";
import AuthApplicationNotice from "./AuthApplicationNotice";
import AuthApplicationFields from "./AuthApplicationFields";
import AuthLocationAssign from "./AuthLocationAssign";
import { EMPTY_ACCOUNT, validateAccount } from "../utils/accountRules";
import { EMPTY_APPLICATION, scoreApplication } from "../utils/applicationScore";
import { useAcceptInviteMutation } from "../../../../store/apis/shared/auth.apis";
import { ROLE_HOME } from "../../../../configs/constants";

// invite holds what the admin already entered, so those fields start filled
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
  const [showNotice, setShowNotice] = useState(true);
  const scores = scoreApplication(form);

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
      }).unwrap();
      navigate(ROLE_HOME[response?.data?.role] ?? "/");
    } catch (error) {
      console.error("Accept invite error:", error);
    }
  };

  return (
    <article className="w-full rounded-2xl bg-white px-5 py-6 shadow-xs sm:px-6">
      <header>
        <AuthHeading
          heading="Create Your Account"
          subheading="Sign Up to create your RCS dashboard"
          className="mb-3"
        />
        {showNotice && (
          <AuthApplicationNotice onDismiss={() => setShowNotice(false)} />
        )}
      </header>

      <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
        <AuthApplicationFields
          form={form}
          scores={scores}
          onChange={handleChange}
          onSelect={handleSelect}
          account={account}
          accountErrors={accountErrors}
          onAccountChange={handleAccountChange}
        />

        {/* Territory drawing on real USA map — display only until the backend stores polygons */}
        <AuthLocationAssign />

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t color-border pt-4">
          <Button
            variant="bare"
            onClick={() => navigate("/signin")}
            className="h-10 rounded-xl border color-border bg-white px-4 text-sm font-medium text-cancel"
          >
            Back to Login
          </Button>

          <div className="flex items-center gap-3">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-remove">
              <Crosshair size={16} />
              Score: {scores.formatted.total}
            </p>
            <Button
              type="submit"
              isLoading={isLoading}
              className="h-10 rounded-xl px-5 text-sm font-medium"
            >
              Create Account
            </Button>
          </div>
        </footer>
      </form>
    </article>
  );
};

export default AuthCreateAccountForm;
