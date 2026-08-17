import { Link } from "react-router-dom";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";
import AuthHeading from "./components/AuthHeading";
import AuthLayout from "./components/AuthLayout";
import BackLink from "./components/BackLink";

const ForgetPassword = () => {
  return (
    <AuthLayout>
      <div className="flex min-h-full items-center justify-center px-6">
        <div className="w-full max-w-106.5 rounded-2xl bg-white px-5 py-10 shadow-sm sm:px-6">
          {/* Heading */}
          <div className="mb-7">
            <AuthHeading
              heading="Forgot password?"
              subheading="Enter the email address associated with your account and we'll send you a link to reset your password."
            />
          </div>

          {/* Form */}
          <form className="space-y-5">
            {/* New Password */}
            <div>
              <div className="relative">
                <Input
                  label="Email address"
                  id="new-password"
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
              <Link to="/check-email">
                <Button
                  iconPosition="right"
                  className="mt-6 h-10 w-full rounded-xl text-sm font-medium"
                >
                  Send reset link
                </Button>
              </Link>
              <BackLink to="/login" text="Back to sign in" className="mt-6" />
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgetPassword;
