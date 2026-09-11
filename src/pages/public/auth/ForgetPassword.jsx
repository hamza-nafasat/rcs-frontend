import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/shared/Button";
import Input from "../../../components/shared/Input";
import AuthHeading from "./components/AuthHeading";
import AuthLayout from "./components/AuthLayout";
import BackLink from "../../../components/shared/BackLink";
import { useForgetPasswordMutation } from "../../../store/apis/public/auth.apis";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await forgetPassword({ email }).unwrap();
      navigate("/check-email", { state: { email } });
    } catch (error) {
      console.log("Forget password error:", error);
    }
  };
  return (
    <AuthLayout>
      <div className="flex min-h-full items-center justify-center px-6">
        <div className="w-full max-w-106.5 rounded-2xl bg-white px-5 py-10 shadow-xs sm:px-6">
          <AuthHeading
            heading="Forgot password"
            subheading="Enter the email address associated with your account and we'll send you a link to reset your password."
          />

          <form className="flex flex-col items-center " onSubmit={handleSubmit}>
            <Input
              label="Email address"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <Button
              type="submit"
              disabled={isLoading}
              iconPosition="right"
              className="mt-6 h-10 w-full rounded-xl text-sm font-medium"
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>
            <BackLink to="/signin" text="Back to sign in" className="mt-6" />
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgetPassword;
