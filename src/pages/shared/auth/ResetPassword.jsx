import { useState } from "react";
import Button from "../../../components/shared/Button";
import Input from "../../../components/shared/Input";
import AuthHeading from "./components/AuthHeading";
import AuthLayout from "./components/AuthLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../../store/apis/shared/auth.apis";
import { validateAccount } from "./utils/accountRules";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [formErrors, setFormErrors] = useState({});
  const [showForNewPassword, setShowForNewPassword] = useState(false);
  const [showForConfirmNewPassword, setShowForConfirmNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateAccount({ password: formData.newPassword, confirmPassword: formData.confirmNewPassword });
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await resetPassword({ resetToken, newPassword: formData.newPassword }).unwrap();
      navigate("/reset-password-success");
    } catch (error) {
      console.error("Reset password error:", error);
    }
  };

  return (
    <AuthLayout>
      <div className="flex min-h-full items-center justify-center px-6">
        <div className="w-full md:w-106.5 rounded-2xl bg-white px-5 py-10 shadow-xs sm:px-6 flex flex-col gap-1">
          {/* Heading */}
          <AuthHeading
            heading="Reset Password"
            subheading="Your new password must be different from your previous password"
          />
          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              label="New Password"
              type={showForNewPassword ? "text" : "password"}
              placeholder="••••••••"
              isEyeButton={true}
              value={formData.newPassword}
              onChange={handleInputChange}
              name="newPassword"
              autoComplete="new-password"
              required
              showConfirm={showForNewPassword}
              setShowConfirm={setShowForNewPassword}
              hint={formErrors.password}
              hintClassName="text-remove"
            />
            <Input
              label="Confirm New Password"
              type={showForConfirmNewPassword ? "text" : "password"}
              placeholder="••••••••"
              isEyeButton={true}
              value={formData.confirmNewPassword}
              onChange={handleInputChange}
              name="confirmNewPassword"
              autoComplete="new-password"
              required
              showConfirm={showForConfirmNewPassword}
              setShowConfirm={setShowForConfirmNewPassword}
              hint={formErrors.confirmPassword}
              hintClassName="text-remove"
            />

            <Button
              type="submit"
              isLoading={isLoading}
              iconPosition="right"
              className="mt-1 h-10 w-full rounded-xl text-sm font-medium"
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
