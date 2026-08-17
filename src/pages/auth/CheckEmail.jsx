import Button from "../../components/shared/Button";
import AuthHeading from "./components/AuthHeading";
import AuthLayout from "./components/AuthLayout";
import { Link } from "react-router-dom";
import BackLink from "./components/BackLink";
import CheckEmailIcon from "../../assets/SVGs/CheckEmailIcon.svg";

const CheckEmail = () => {
  return (
    <AuthLayout>
      <div className="flex min-h-full items-center justify-center px-6">
        <div className="w-full max-w-106.5 rounded-2xl bg-white px-5 py-10 shadow-sm sm:px-6">
          {/* Heading */}
          <div className="mb-7 flex flex-col items-center justify-center text-center">
            <img src={CheckEmailIcon} alt="Check email" className="mb-4" />
            <AuthHeading
              heading="Check your email"
              subheading={
                <>
                  We've sent a password reset link to{" "}
                  <span className="font-medium text-tertiary">
                    {/* {user?.email} */} email@
                  </span>
                  . Click the link in the email to reset your password.
                </>
              }
            />
          </div>

          <div>
            <Button
              iconPosition="right"
              className="mt-6 h-10 w-full rounded-xl text-sm font-medium"
            >
              Open email app
            </Button>

            <div className="mt-6 text-center text-sm text-gray-500">
              Didn't receive the email?{" "}
              <Link
                //   to="/resend-email"
                className="font-medium text-primary hover:text-primary/10"
              >
                Resend
              </Link>
            </div>
            <BackLink text="Back to login" to="/" className="mt-6" />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default CheckEmail;
