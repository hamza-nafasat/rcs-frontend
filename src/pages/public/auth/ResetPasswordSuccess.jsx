import AuthHeading from "./components/AuthHeading";
import AuthLayout from "./components/AuthLayout";
import SuccessfulIcon from "../../../assets/SVGs/SuccessfulIcon.svg";
import Button from "../../../components/shared/Button";
import { useNavigate } from "react-router-dom";

const ResetPasswordSuccess = () => {
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <div className="flex min-h-full items-center justify-center px-6">
        <div className="w-full max-w-106.5 rounded-2xl bg-white px-5 py-10 shadow-xs sm:px-6">
          {/* Heading */}
          <div className="mb-7 flex flex-col items-center justify-center text-center">
            <img src={SuccessfulIcon} alt="Check email" className="mb-4" />
            <AuthHeading
              heading="Password reset successful"
              subheading="Your password has been successfully reset. You can now sign in with your new password."
            />
          </div>

          <Button
            onClick={() => navigate("/signin")}
            iconPosition="right"
            className="h-10 w-full rounded-xl text-sm font-medium"
          >
            Back to sign in
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordSuccess;
