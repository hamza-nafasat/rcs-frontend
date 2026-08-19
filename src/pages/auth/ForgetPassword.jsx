import { useNavigate } from "react-router-dom";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";
import AuthHeading from "./components/AuthHeading";
import AuthLayout from "./components/AuthLayout";
import BackLink from "./components/BackLink";

const ForgetPassword = () => {
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <div className="flex min-h-full items-center justify-center px-6">
        <div className="w-full max-w-106.5 rounded-2xl bg-white px-5 py-10 shadow-xs sm:px-6">
          <AuthHeading
            heading="Forgot password"
            subheading="Enter the email address associated with your account and we'll send you a link to reset your password."
          />

          <form className="flex flex-col item-center ">
            <Input
              label="Email address"
              id="new-password"
              type="email"
              placeholder="Enter your email"
            />

            <Button
              type="button"
              onClick={() => navigate("/check-email")}
              iconPosition="right"
              className="mt-6 h-10 w-full rounded-xl text-sm font-medium"
            >
              Send reset link
            </Button>
            <BackLink to="/signin" text="Back to sign in" className="mt-6" />
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgetPassword;
