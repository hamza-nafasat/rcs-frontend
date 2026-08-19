import { useState } from "react";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";
import AuthHeading from "./components/AuthHeading";
import AuthLayout from "./components/AuthLayout";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showForNewPassword, setShowForNewPassword] = useState(false);
  const [showForConfirmNewPassword, setShowForConfirmNewPassword] =
    useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    navigate("/reset-password-success");
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
          <form className="flex flex-col gap-5" onSubmit={handleInputChange}>
            <Input
              label="New Password"
              type={showForNewPassword ? "text" : "password"}
              placeholder="••••••••"
              isEyeButton={true}
              value={formData.newPassword}
              onChange={handleInputChange}
              name="newPassword"
              showConfirm={showForNewPassword}
              setShowConfirm={setShowForNewPassword}
            />
            <Input
              label="Confirm New Password"
              type={showForConfirmNewPassword ? "text" : "password"}
              placeholder="••••••••"
              isEyeButton={true}
              value={formData.confirmNewPassword}
              onChange={handleInputChange}
              name="confirmNewPassword"
              showConfirm={showForConfirmNewPassword}
              setShowConfirm={setShowForConfirmNewPassword}
            />
            <Button
              type="submit"
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
